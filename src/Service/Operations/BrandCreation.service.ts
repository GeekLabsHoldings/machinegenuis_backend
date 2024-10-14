import BrandsModel, {SubBrandModel} from "../../Model/Operations/BrandCreation.model";
import { ClientSession, Types, startSession } from "mongoose";
import BrandType from "../../Model/Operations/IBrand_interface";
import {
  ISubBrand,
  IBrand,
} from "../../Model/Operations/IBrand_interface";
import {
  
  accountDataType,
} from "../../Model/Operations/IPostingAccounts_interface";
import SocialPostingAccount from "../../Model/Operations/SocialPostingAccount.model";
import crypto, { Encoding } from "crypto";
import Route53DomainChecker, { ContactDetail } from "../AWS/Rout53/domains";
import { log } from "console";
import AwsDomainActivation from "../AWS/Rout53/domain_activation";

// import { Request, Response } from 'express';

export const addBrandWithSubandAccounts = async (
  brandData: IBrand,
  subBrands: { subbrand: ISubBrand; accounts: accountDataType[] }[],
  accounts: accountDataType[]
) => {
  console.log("adding brand with all data");
  const session = await startSession();
  try {
    session.startTransaction();

    const newbrand = new BrandsModel({ ...brandData });
    const Brand = await newbrand.save({ session });
  
    for (const sub of subBrands) {
      const subbrand = await createSubBrand(Brand._id, {...sub.subbrand, niche:Brand.niche}, session, false);
      for (const acc of sub.accounts) {
        if (subbrand && subbrand._id){const account = await addOrDeleteAccount(subbrand._id, acc, session);}    
      }
    }
    for (const acc of accounts) {
      const account = await addOrDeleteAccount(Brand._id, acc, session);
    }
    await session.commitTransaction();
    return Brand;
    
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
  } finally {
    session.endSession();
  }
};



export const getAllBrands = async (skip?:number, limit?:number) => {
  try {
    const brands = await BrandsModel.find({ type: { $ne: "subbrand" } }).skip(skip||0).limit(limit||0);

    //console.log(brands)
    const brandswithData: {
      brand: IBrand;
      subBrands: ISubBrand[];
      accounts: accountDataType[];
    }[] = [];
    for (const brand of brands) {
      if (brand._id) {
        const subBrands = await getAllSubBrands(brand._id);
        const accounts = await getAccounts(brand._id);
        brandswithData.push({
          brand: brand,
          subBrands: subBrands,
          accounts: accounts,
        });
      }
    }
    return brandswithData;
  } catch (error) {
    console.log(error);
  }
};




export const getSingularBrands = async (skip:number, limit:number) => {
  try {
    const brands = await BrandsModel.find({}).skip(skip || 0).limit(limit || 999999);

    const singular = await Promise.all(
      brands.map(async (brand) => {
        const b = await SubBrandModel.findOne({ parentId: brand._id });
        // If sub-brand exists (b), return false, otherwise true
        return b ? false : brand;
      })
    );
    
    // Filter out the `false` values (those with children)
    const result = singular.filter(brand => brand !== false);
    
    return result;
    

  } catch (error) {
    console.log(error);
  }
};




export const getBrands = async (skip:number, limit:number) => {
  try {
    //const brands = await BrandsModel.find({ }).skip(skip).limit(limit);

    const brands = await BrandsModel.find().skip(skip||0).limit(limit||999999);
    return brands;

  } catch (error) {
    console.log(error);
  }
};



export const getBrandsByPlatform = async (platform:string, skip:number, limit:number) => {
  try{
  const accounts = await SocialPostingAccount.find({platform:platform}).skip(skip||0).limit(limit||999999);
 // console.log(`getBrandsByPlatform ${accounts}`);
  
  const brands : (IBrand|ISubBrand)[] = []
  for(const acc of accounts){
    const b = await BrandsModel.findById(acc.brand)
    if (b)
      brands.push(b)
  }
  return brands;

} catch (error) {
  console.log(error);
}
};



export const getBrandById = async (id: string) => {
  try {
    const brand: IBrand | null = await BrandsModel.findById(id);

    let brandwithData: { brand: IBrand; subBrands: ISubBrand[] } | null = null;
    if (brand?._id) {
      let subBrands: ISubBrand[] = await getAllSubBrands(brand._id);
      brandwithData = { brand: brand, subBrands: subBrands };
    }
    return brandwithData;
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
  const session = await startSession();
  try {
    session.startTransaction();
    await SocialPostingAccount.deleteMany({brand:id}).session(session)
    await SubBrandModel.deleteMany({parentId:id}).session(session)

    const d =  await BrandsModel.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    return d
  }  catch (error) {
    await session.abortTransaction();
    console.log(error);
  } finally {
    session.endSession();
  }
};
export const getAllSubBrands = async (
  parentId: string,
  skip?:number,
  limit?:number
):Promise<ISubBrand[]> => {
  const brand = await BrandsModel.findById(parentId)
  if(!brand){
    return []
  }
  return await SubBrandModel.find({ type: "subbrand", parentId }).skip(skip||0).limit(limit||9999999);
};
export const getSubBrandById = async (parentId: string, id: string, skip:number, limit:number) => {
  const brand = await BrandsModel.findById(parentId)
  if(!brand){
    return null
  }
  return await BrandsModel.findOne({ _id: id, type: "subbrand", parentId }).skip(skip).limit(limit);
};



export const createSubBrand = async (
  parentId: string,
  subBrandData: ISubBrand,
  session?: ClientSession,
  f: boolean = true
) => {

  if (!f){
    const newSubBrand = new BrandsModel({
      ...subBrandData,
      type: "subbrand",
      parentId,
    });
    return await newSubBrand.save({ session });
  }else{
    const Brand = await BrandsModel.findOne({_id:parentId})
    console.log(`creating subbrand for ${Brand?._id}`);
    
    if(Brand){
      const newSubBrand = new BrandsModel({
        ...subBrandData,
        type: "subbrand",
        parentId,
      });
    return await newSubBrand.save({ session });
    }
    return null
  }

};



export const updateSubBrand = async (
  parentId: string,
  id: string,
  subBrandData: Partial<ISubBrand>
) => {
  return await BrandsModel.findOneAndUpdate(
    { _id: id, type: "subbrand", parentId },
    subBrandData,
    { new: true }
  );
};
export const deleteSubBrand = async (parentId: string, id: string) => {


  const session = await startSession();
  try {
    session.startTransaction();
    await SocialPostingAccount.deleteMany({brand:id}).session(session)
    await SubBrandModel.deleteMany({parentId:id}).session(session)

    await session.commitTransaction();
    await session.commitTransaction();
    const d = await BrandsModel.findOneAndDelete({
      _id: id,
      type: "subbrand",
      parentId,
    });
    return d

  }  catch (error) {
    await session.abortTransaction();
    console.log(error);
  } finally {
    session.endSession();
  }
};

//=========================================================================
export async function checkAndSuggest(domainName: string) {
  const checker = new Route53DomainChecker();

  const isAvailable = await checker.isDomainAvailable(domainName);
  console.log(`Is ${domainName} available? ${isAvailable}`);
  if (!isAvailable) {
    const suggestions = await checker.getDomainSuggestions(domainName);
    console.log("Suggestions:", suggestions);
    return { isAvailable, suggestions };
  }
  return { isAvailable };
}




export async function registerDomain(
  domainName: string,
  DurationInYears: number,
  brand:string,
  contactDetails: ContactDetail
) {
  const checker = new Route53DomainChecker();
  
  const result = await checker.registerDomain(
    domainName,
    DurationInYears,
    contactDetails
  );
  await BrandsModel.updateOne(
    { _id: brand },               // Filter: Find the brand by its ID
    { $set: { domain: domainName }} // Update: Set the domain name
  );
  console.log(`Is domain result is ${result}`);

  return result;
}

export async function verificationDomain(domainName:string) {
  try {
    const domainManager = new AwsDomainActivation();
    const emailVerificationStatus = await domainManager.checkDomainVerificationStatus(domainName);
    return emailVerificationStatus
  } catch (error) {
    console.log(error);
  }
}


export async function activateDomain(domainName:string, brand:string){
  try {
    const domainManager = new AwsDomainActivation();


  // Step 1: Create Hosted Zone
  const HostedZoneId = await domainManager.createHostedZone(domainName);

if (HostedZoneId) {
  // Step 2: Update Name Servers for the domain
  const nameServers = await domainManager.getNameServers(HostedZoneId);
  if (nameServers) {
    await domainManager.updateNS(domainName, nameServers, HostedZoneId);
  }

  // Step 3: Request SSL
  const CertificateArn = await domainManager.requestCertificate(domainName);

  if (CertificateArn) {
    // Step 4: Get DNS CName Name CName value
    const cnameRecord = await domainManager.getDnsValidationRecords(CertificateArn);

    if (cnameRecord) {
      // Step 5: Add CNAME for SSL validation
      await domainManager.addHostedZoneRecord(domainName, cnameRecord, HostedZoneId, 'CNAME');
    }
  }
}
  } catch (error) {
    console.log(error);
  }
}



//============================================================


export const getAccounts = async (id: string) => {
  // Implement account retrieval logic
  const brand = await BrandsModel.findById(id)
  if(!brand){
    return []
  }
  const accounts = await SocialPostingAccount.find({ brand: id });

  const data: accountDataType[] = [];
  for (const account of accounts) {
    const decrypted = decrypt(account.token);
    if (account.platform == "TELEGRAM") {
      data.push({
        platform: account.platform,
        account: { token: decrypted || " " },
      });
      continue;
    }
    const obj = JSON.parse(String(decrypted));
    data.push({ platform: account.platform, account: obj });
  }
  return data;
};
export const checkBrand = async (brand: string) => {
  const brands = await BrandsModel.findById(brand);
  return brands;
};
export const getAccount = async (id: string, platform: string) => {
  // Implement account retrieval logic
  const brand = await BrandsModel.findById(id)
  if(!brand){
    return null
  }
  const account = await SocialPostingAccount.findOne({
    brand: id,
    platform: platform,
  });
  if (account) {
    let decrypted = decrypt(account.token);
    //console.log("encryption\t", decrypted, account.token)
    if (account.platform == "TELEGRAM")
      return {
        platform: account.platform,
        account: { token: decrypted || " " },
      };

    let obj = JSON.parse(String(decrypted));

    return { platform: account.platform, account: obj };
  }

  return null;
};



export const addOrDeleteAccount = async (
  id: string,
  accountData: accountDataType,
  session?: ClientSession
) => {
  // Implement account addition or deletion logic
  try {
    const result = await SocialPostingAccount.deleteOne({
      platform: accountData.platform.toUpperCase(),
      brand: id,
    }, { session });
    //console.log(accountData)
    if (result.deletedCount === 1) {
      console.log("Account deleted successfully!");
    } else {
      console.log("Account not found.");
    }
    if (accountData.platform != "TELEGRAM") {
      let payload = { ...accountData.account };
      let payloadStr = JSON.stringify(payload);
      const token = encrypt(payloadStr);
      
      const Account = new SocialPostingAccount({
        token: token,
        platform: accountData.platform,
        brand: id,
      });
      const acc = await Account.save({ session });
      console.log("Account added successfully!");
      return acc;
    } else if (
      accountData.platform == "TELEGRAM" &&
      "token" in accountData.account
    ) {
      let payload = accountData.account.token;
      const token = encrypt(payload||"");
      const Account = new SocialPostingAccount({
        token: token,
        platform: accountData.platform,
        brand: id,
      });
      const acc = await Account.save();
      console.log("Account added successfully!");
      return acc;
    }
  } catch (error) {
    console.log(error);
  }
};


export const deleteAccount = async (acc_id: string) => {
  try {
    const delAccount = await SocialPostingAccount.findByIdAndDelete(acc_id);
    if (delAccount) {
      console.log('Account deleted successfully:', delAccount);
      return delAccount
    } else {
      console.log('No account found with the provided ID.');
      return null
    }
    
  } catch (error) {
    console.log('Error deleting account:', error);
  }
};



function encrypt(text: string): string | null {
  const sk: String | undefined = process.env.SECRET_KEY;
  if (sk) {
    const secretKey = Buffer.from(sk, "hex");

    const cipher = crypto.createCipheriv("aes-256-ecb", secretKey, null); // No IV for ECB
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }
  return null;
}
export function decrypt(encryptedData: string): string | null {
  const sk: String | undefined = process.env.SECRET_KEY;
  if (sk) {
    const secretKey = Buffer.from(sk, "hex");
    const decipher = crypto.createDecipheriv("aes-256-ecb", secretKey, null); // No IV for ECB
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
  return null;
}












