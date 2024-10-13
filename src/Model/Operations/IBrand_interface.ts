import { model, Schema, Types } from 'mongoose';
import { PlatformArr, PlatformEnum } from "../../Utils/SocialMedia/Platform";

export interface IBrand   {
    _id?:string
    brand_name: string;
    domain?:string
    description: string;
    niche: string;
    aquisition_date:Number
   
}

export interface ISubBrand extends IBrand{
    parentId: Types.ObjectId | string | IBrand
}

export interface IBrandWithSubs extends IBrand{
    subBrands: IBrand[]
}

type BrandType = IBrand | ISubBrand
export default BrandType