import systemError from "../../Utils/Error/SystemError";
 import * as brandService from "../../Service/Operations/BrandCreation.service"
import { Request, Response } from 'express';
import BrandsModel from "../../Model/Operations/BrandCreation.model";
import { startSession } from "mongoose";
import { ContactDetail } from "../../Service/AWS/Rout53/domains"; 
import { accountDataType } from "../../Model/Operations/IPostingAccounts_interface";
import { IBrand, ISubBrand } from "../../Model/Operations/IBrand_interface";
import { ImportVolumeCommand } from "@aws-sdk/client-ec2";
import { PlatformArr } from "../../Utils/SocialMedia/Platform";



export const getAllBrands = async (req: Request, res: Response) => {
  try {
      const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
      const limit = parseInt(String(req.query.limit)) || 10; // Default to 10 items per page if not provided
      const skip = (page - 1) * limit;
    const brands = await brandService.getAllBrands(skip, limit);
    // console.log(brands)
    res.json(brands);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};


export const getBrands = async (req: Request, res: Response) => {
  try {
    const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
    const limit = parseInt(String(req.query.limit)) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit;
    const brands = await brandService.getBrands(skip, limit);
    // console.log(brands)
    res.json(brands);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};




export const getBrandsByPlatform = async (req: Request, res: Response) => {
  try {
    const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
    const limit = parseInt(String(req.query.limit)) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit;
    const brands = await brandService.getBrandsByPlatform(String(req.query.platform), skip, limit);
    // console.log(brands)
    res.json(brands);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};





export const getAllBrandsByPlatform = async (req: Request, res: Response) => {
  try {
    const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
    const limit = parseInt(String(req.query.limit)) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit;
    const allBrands: {platform: string, brands:(IBrand|ISubBrand)[]}[] = []
    for(const platform of PlatformArr){
      
      const brands = await brandService.getBrandsByPlatform(platform, skip, limit);
      //console.log(`This is platform ${platform} for all this brands ${brands}`)
      if(brands && brands.length>0)
        allBrands.push({platform:platform, brands:brands})
    }
    
    // console.log(brands)
    res.json(allBrands);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};




export const getBrand = async (req: Request, res: Response) => {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};




export const getSingularBrands = async (req: Request, res: Response) => {
  try {
    const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
    const limit = parseInt(String(req.query.limit)) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit;
    const brand = await brandService.getSingularBrands(skip, limit);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};


export const addBrand = async (req: Request, res: Response) => {
  try {
    const newBrand = await brandService.createBrand(req.body);
    res.status(201).json(newBrand);
  } catch (error) {
    console.log(error)
    return systemError.sendError(res, error);
  }
};


export const addBrandWithAllData = async (req: Request, res: Response) => {
  try {
     const  brandData: IBrand = req.body.brandData
     const subBrands:{subbrand:ISubBrand, accounts:accountDataType[]}[] = req.body.brandData.subBrands
     const accounts:accountDataType[] = req.body.brandData.accounts
     console.log("adding a brand with all data");
     
     const newBrand = await brandService.addBrandWithSubandAccounts(brandData, subBrands, accounts);

    res.status(201).json(newBrand);
  } catch (error) {
    console.log(error)
    return systemError.sendError(res, error);
  }finally{
  }
};


export const editBrand = async (req: Request, res: Response) => {
  try {
    const updatedBrand = await brandService.updateBrand(req.params.id, req.body);
    if (!updatedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(updatedBrand);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {

    const deletedBrand = await brandService.deleteBrand(req.params.id);
    if (!deletedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};

export const getAllSubBrands = async (req: Request, res: Response) => {
  try {
    const subBrands = await brandService.getAllSubBrands(req.params.parentId);
    if (!subBrands || subBrands.length == 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(subBrands);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};

export const getSubBrand = async (req: Request, res: Response) => {
  try {
    const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
    const limit = parseInt(String(req.query.limit)) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit;
    const subBrand = await brandService.getSubBrandById(req.params.parentId, req.params.id, page, skip);
    if (!subBrand) {
      return res.status(404).json({ message: 'Sub-brand not found' });
    }
    res.json(subBrand);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};

export const addSubBrand = async (req: Request, res: Response) => {
  try {
    const newSubBrand = await brandService.createSubBrand(req.params.parentId, req.body);
    if (newSubBrand)
      return res.status(201).json(newSubBrand);

    return res.status(404).json({message:"brand not found"});
  } catch (error) {
    return systemError.sendError(res, error);
  }
};


export const editSubBrand = async (req: Request, res: Response) => {
  try {
    const updatedSubBrand = await brandService.updateSubBrand(req.params.parentId, req.params.id, req.body);
    if (!updatedSubBrand) {
      return res.status(404).json({ message: 'Sub-brand not found' });
    }
    res.json(updatedSubBrand);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};

export const deleteSubBrand = async (req: Request, res: Response) => {
  try {
    const deletedSubBrand = await brandService.deleteSubBrand(req.params.parentId, req.params.id);
    if (!deletedSubBrand) {
      return res.status(404).json({ message: 'Sub-brand not found' });
    }
    res.json({ message: 'Sub-brand deleted successfully' });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};

export const getAccounts = async (req: Request, res: Response) => {
  try {
    
    const account = await brandService.getAccounts(req.params.id);
    if (!account || account.length ==0) {
      return res.status(404).json({ message: 'account not found' });
    }
    res.json(account);
  } catch (error) {
    console.log(error)
    return systemError.sendError(res, error);
  }
};



export const getAccount = async (req: Request, res: Response) => {
  try {
    const account = await brandService.getAccount(req.params.id, String(req.query.platform));
    if (!account) {
      return res.status(404).json({ message: 'account not found' });
    }
    res.json(account);
  } catch (error) {
    console.log(error)
    return systemError.sendError(res, error);
  }
};


export const addOrChangeAcount = async (req: Request, res: Response) => {
  try {
    //appID:string, appSecret:string, username:string, password:string, brand:string|Types.ObjectId
    let accountData:accountDataType
    if (req.body.platform.toUpperCase()=="REDDIT"){
      accountData = {platform:req.body.platform,
         account:{appID:req.body.appID, appSecret:req.body.appSecret,
           username:req.body.username, password:req.body.password}}
      const result = await brandService.addOrDeleteAccount(req.params.id, accountData);
      return  res.json(result);
    }
    else if (req.body.platform.toUpperCase()=="LINKEDIN"){
      accountData = {platform:req.body.platform,
         account:{token:req.body.token, owner:req.body.owner,}}
      const result = await brandService.addOrDeleteAccount(req.params.id, accountData);
      return  res.json(result);
    }
    else if (req.body.platform.toUpperCase()=="TWITTER"){
      console.log(req.body)
      accountData = {platform:req.body.platform,
         account:{ConsumerKey:req.body.ConsumerKey, ConsumerSecret:req.body.ConsumerSecret,
          AccessToken:req.body.AccessToken, TokenSecret:req.body.TokenSecret, BearerToken:req.body.BearerToken}}
      const result = await brandService.addOrDeleteAccount(req.params.id, accountData);
      return  res.json(result);
    }
    else if (req.body.platform.toUpperCase()=="FACEBOOK"){
      accountData = {platform:req.body.platform,
        account:{token:req.body.token, pageID:req.body.pageID,}}

     const result = await brandService.addOrDeleteAccount(req.params.id, accountData);
     return  res.json(result);
    }
    else if (req.body.platform.toUpperCase()=="TELEGRAM"){
      accountData = {platform:req.body.platform,
         account:{token:req.body.token}}
      const result = await brandService.addOrDeleteAccount(req.params.id, accountData);
      return  res.json(result);
    }
    return res.status(400).json({message:"error adding account check Platform and the correct Inputs for the platform"});
  } catch (error) {
    return systemError.sendError(res, error);
  }
};


export const checkDomains = async (req: Request, res: Response) => {
  try {
    const result = await brandService.checkAndSuggest(req.body.domainName);
    res.json(result);
  } catch (error) {
    console.log(error);
    return systemError.sendError(res, error);
  }
};

export const registerDomain = async (req: Request, res: Response) => {
  try {
    const contactDetail:ContactDetail = {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      ContactType: req.body.ContactType,
      AddressLine1: req.body.AddressLine1,
      City: req.body.City,
      State: req.body.State,
      CountryCode: req.body.CountryCode,
      ZipCode: req.body.ZipCode,
      PhoneNumber: req.body.PhoneNumber,
      Email: req.body.Email,
    };
    const result = await brandService.registerDomain(req.body.domainName, req.body.DurationInYears, contactDetail);
    res.json(result);
  } catch (error) {
    console.log(error);
    return systemError.sendError(res, error);
  }
};