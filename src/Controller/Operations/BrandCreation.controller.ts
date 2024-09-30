import systemError from "../../Utils/Error/SystemError";
 import * as brandService from "../../Service/Operations/BrandCreation.service"
import { Request, Response } from 'express';
import BrandsModel from "../../Model/Operations/BrandCreation.model";


export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const brands = await brandService.getAllBrands();
    // console.log(brands)
    res.json(brands);
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



export const addBrand = async (req: Request, res: Response) => {
  try {
    const newBrand = await brandService.createBrand(req.body);
    res.status(201).json(newBrand);
  } catch (error) {
    console.log(error)
    return systemError.sendError(res, error);
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
    res.json(subBrands);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};

export const getSubBrand = async (req: Request, res: Response) => {
  try {
    const subBrand = await brandService.getSubBrandById(req.params.parentId, req.params.id);
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
    res.status(201).json(newSubBrand);
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

export const getAccount = async (req: Request, res: Response) => {
  try {
    const account = await brandService.getAccount(req.params.id);
    res.json(account);
  } catch (error) {
    console.log(error)
    return systemError.sendError(res, error);
  }
};

export const addOrChangeAcount = async (req: Request, res: Response) => {
  try {
    const result = await brandService.addOrDeleteAccount(req.params.id, req.body);
    res.json(result);
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