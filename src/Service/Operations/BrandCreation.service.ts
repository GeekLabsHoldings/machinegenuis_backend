import BrandsModel from "../../Model/Operations/BrandCreation.model";
import { Types, startSession } from 'mongoose';
import BrandType from "../../Model/Operations/IBrand_interface";
import { ISubBrand, IBrand, IBrandWithSubs } from "../../Model/Operations/IBrand_interface";
import { IAccount, IRedditAccountData, ITelegramAccountData, accountDataType } from "../../Model/Operations/IPostingAccounts_interface";
import SocialPostingAccount from "../../Model/Operations/SocialPostingAccount.model";
import crypto, { Encoding } from 'crypto';
import Route53DomainChecker, { ContactDetail } from "../AWS/Rout53/domains";





// import { Request, Response } from 'express';

export const addBrandWithSubandAccounts = async (brandData: IBrand,
   subBrands:{subbrand:ISubBrand, accounts:accountDataType[]}[],
    accounts:accountDataType[]) => {

      console.log("adding brand with all data")
  const session = await startSession();
  try {
    session.startTransaction();

    const newbrand = new BrandsModel({...brandData});
    const Brand = await newbrand.save()
    for(const sub of subBrands){
      const subbrand = await createSubBrand(Brand._id, sub.subbrand)
      for (const acc of sub.accounts){
          const account = await addOrDeleteAccount(subbrand._id, acc)
      }
    }

    for (const acc of accounts){
      const account = await addOrDeleteAccount(Brand._id, acc)
    }
    return Brand
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.log(error)
  } finally {
    session.endSession();
  }
};


export const getAllBrands = async () => {

  try {
    const brands = await BrandsModel.find({ type: { $ne: 'subbrand' } });

    //console.log(brands)
    const brandswithData: { brand: IBrand, subBrands: ISubBrand[], accounts:accountDataType[] }[] = []
    for (const brand of brands) {
      if (brand._id) {
        const subBrands = await getAllSubBrands(brand._id)
        const accounts = await getAccounts(brand._id)
        brandswithData.push({ brand: brand, subBrands: subBrands, accounts:accounts })
      }
  
    }
    return brandswithData
  } catch (error) {
    console.log(error);
    
  }

 
};

export const getBrandById = async (id: string) => {


  try {
    const brand: IBrand | null = await BrandsModel.findById(id);

    let brandwithData: { brand: IBrand, subBrands: ISubBrand[] } | null = null
    if (brand?._id) {
      let subBrands: ISubBrand[] = await getAllSubBrands(brand._id)
      brandwithData = { brand: brand, subBrands: subBrands }
    }
    return brandwithData    
  } catch (error) {
    console.log(error);
  }
};

export const createBrand = async (brandData: IBrand) => {

  try {
    const newBrand = new BrandsModel(brandData);
    return await newBrand.save();
  } catch (error) {
    console.log(error);
  }
};

export const updateBrand = async (id: string, brandData: Partial<IBrand>) => {
 
  try {
    return await BrandsModel.findByIdAndUpdate(id, brandData, { new: true });
  } catch (error) {
    console.log(error);
  }
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


export async function registerDomain(domainName: string,DurationInYears:number, contactDetails: ContactDetail) {
  const checker = new Route53DomainChecker();

  const result = await checker.registerDomain(domainName,DurationInYears, contactDetails);
  console.log(`Is domain result is ${result}`);

  return result

}




// Placeholder for account-related functions
export const getAccounts = async (id: string, ) => {
  // Implement account retrieval logic
  const accounts = await SocialPostingAccount.find({brand: id, });

  const data :accountDataType[] = []
  for(const account of accounts){
      const decrypted = decrypt(account.token)
      if (account.platform == "TELEGRAM"){
        data.push({platform:account.platform, account:{token:decrypted||" "}})
        continue
      }    
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

    if (account.platform == "TELEGRAM")
        return {platform:account.platform, account:{token:decrypted||" "}}

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
    if (accountData.platform == "REDDIT"){
      let payload = { ...accountData.account };
      let payloadStr = JSON.stringify(payload)
      const token = encrypt(payloadStr)
      // console.log("encryption\t",accountData, payload, payloadStr, token)
      const Account = new SocialPostingAccount({
        token: token,
        platform: accountData.platform,
        brand: id
      });
      const acc = await Account.save()
      console.log('Account added successfully!');
      return acc
    }
    else if(accountData.platform == "TELEGRAM" && "token" in accountData.account){
      let payload = accountData.account.token ;
      const token = encrypt(payload)
      const Account = new SocialPostingAccount({
        token: token,
        platform: accountData.platform,
        brand: id
      });
      const acc = await Account.save()
      console.log('Account added successfully!');
      return acc
    }
    


  } catch (error) {
    console.log(error)
  }
};







function encrypt(text: string): string | null {
  const sk: String | undefined = process.env.SECRET_KEY
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
  const sk: String | undefined = process.env.SECRET_KEY
  if (sk) {
    const secretKey = Buffer.from(sk, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-ecb', secretKey, null); // No IV for ECB
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    
    decrypted += decipher.final('utf8');

    return decrypted;
  }
  return null
}





