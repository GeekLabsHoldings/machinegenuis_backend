import { Types } from "mongoose";
import { IBrand } from "../../../Model/Operations/IBrand_interface"; 

export default interface IZohoEmailCreation {
    accountId: string;
    accountName: string;
    accountEmail: string;
    zohoId: string;
    domain: string;
    brand: Types.ObjectId | string | null | IBrand,
    department: Array<string>;
    isAdminAccount?: Boolean
}