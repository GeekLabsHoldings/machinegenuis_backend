import BrandsModel from "../../Model/Operations/BrandCreation.model";
import { Types, startSession } from 'mongoose';
import BrandType from "../../Model/Operations/IBrand_interface";
import { ISubBrand, IBrand, IBrandWithSubs } from "../../Model/Operations/IBrand_interface";
import { IAccount, IRedditAccountData, ITelegramAccountData, accountDataType } from "../../Model/Operations/IPostingAccounts_interface";
import SocialPostingAccount from "../../Model/Operations/SocialPostingAccount.model";
import crypto, { Encoding } from 'crypto';
import Route53DomainChecker from "../AWS/Rout53/domains";





// import { Request, Response } from 'express';

export const addBrandWithSubandAccounts = async () => {
  const session = await startSession();
  try {
    session.startTransaction();

    const newbrand = new BrandsModel({});



    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.log(error)
  } finally {
    session.endSession();
  }
};


export const getAllBrands = async () => {
  const brands = await BrandsModel.find({ type: { $ne: 'subbrand' } });

  console.log(brands)
  const brandswithData: { brand: IBrand, subBrands: ISubBrand[], accounts:accountDataType[] }[] = []
  for (const brand of brands) {
    if (brand._id) {
      const subBrands = await getAllSubBrands(brand._id)
      const accounts = await getAccounts(brand._id)
      brandswithData.push({ brand: brand, subBrands: subBrands, accounts:accounts })
    }

  }
  return brandswithData
};

export const getBrandById = async (id: string) => {
  const brand: IBrand | null = await BrandsModel.findById(id);

  let brandwithData: { brand: IBrand, subBrands: ISubBrand[] } | null = null
  if (brand?._id) {
    let subBrands: ISubBrand[] = await getAllSubBrands(brand._id)
    brandwithData = { brand: brand, subBrands: subBrands }
  }
  return brandwithData
};

export const createBrand = async (brandData: IBrand) => {
  const newBrand = new BrandsModel(brandData);
  return await newBrand.save();
};

export const updateBrand = async (id: string, brandData: Partial<IBrand>) => {
  return await BrandsModel.findByIdAndUpdate(id, brandData, { new: true });
};

export const deleteBrand = async (id: string) => {
  return await BrandsModel.findByIdAndDelete(id);
};

export const getAllSubBrands = async (parentId: string): Promise<ISubBrand[]> => {
  return await BrandsModel.find({ type: 'subbrand', parentId });
};

export const getSubBrandById = async (parentId: string, id: string) => {
  return await BrandsModel.findOne({ _id: id, type: 'subbrand', parentId });
};

export const createSubBrand = async (parentId: string, subBrandData: ISubBrand) => {
  const newSubBrand = new BrandsModel({
    ...subBrandData,
    type: 'subbrand',
    parentId,
  });
  return await newSubBrand.save();
};

export const updateSubBrand = async (parentId: string, id: string, subBrandData: Partial<ISubBrand>) => {
  return await BrandsModel.findOneAndUpdate(
    { _id: id, type: 'subbrand', parentId },
    subBrandData,
    { new: true }
  );
};

export const deleteSubBrand = async (parentId: string, id: string) => {
  return await BrandsModel.findOneAndDelete({ _id: id, type: 'subbrand', parentId });
};





export async function checkAndSuggest(domainName:string) {
  const checker = new Route53DomainChecker();

  const isAvailable = await checker.isDomainAvailable(domainName);
  console.log(`Is ${domainName} available? ${isAvailable}`);
  if (!isAvailable) {
    const suggestions = await checker.getDomainSuggestions(domainName);
    console.log('Suggestions:', suggestions);
    return {isAvailable, suggestions}
  }
  return {isAvailable}

}





// Placeholder for account-related functions
export const getAccounts = async (id: string, ) => {
  // Implement account retrieval logic
  const accounts = await SocialPostingAccount.find({brand: id, });

  const data :accountDataType[] = []
  for(const account of accounts){
      const decrypted = decrypt(account.token)
      const obj = JSON.parse(String(decrypted))
      data.push({platform:account.platform, account:obj})
  }
  return data
};


export const getAccount = async (id: string, platform:string) => {
  // Implement account retrieval logic
  const account = await SocialPostingAccount.findOne({brand: id, platform:platform});
  if (account){
    let decrypted = decrypt(account.token)
    let obj = JSON.parse(String(decrypted))
  
    return {platform:account.platform, account:obj}
  
  }

  return null
};

export const addOrDeleteAccount = async (id: string, accountData: accountDataType) => {
  // Implement account addition or deletion logic
  try {

    const result = await SocialPostingAccount.deleteOne({ platform: accountData.platform, brand: id, });

    if (result.deletedCount === 1) {
      console.log('Account deleted successfully!');
    } else {
      console.log('Account not found.');
    }

    let payload = { ...accountData.account };
    let payloadStr = JSON.stringify(payload)
    const token = encrypt(payloadStr)

    const Account = new SocialPostingAccount({
      token: token,
      platform: accountData.platform,
      brand: id
    });

    Account.save()
    console.log('Account added successfully!');
  } catch (error) {
    console.log(error)
  }
};







function encrypt(text: string): string | null {
  const sk: String | undefined = process.env.ENCRYPTION_SECRET_KEY
  if (sk) {
    const secretKey = Buffer.from(sk, 'hex');

    const cipher = crypto.createCipheriv('aes-256-ecb', secretKey, null); // No IV for ECB
    let encrypted = cipher.update(text, "utf8", 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  return null
}


function decrypt(encryptedData: string): string | null {
  const sk: String | undefined = process.env.ENCRYPTION_SECRET_KEY
  if (sk) {
    const secretKey = Buffer.from(sk, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-ecb', secretKey, null); // No IV for ECB
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  return null
}




