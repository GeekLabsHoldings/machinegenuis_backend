import { Types } from "mongoose";
import { IBrand } from "../../Operations/IBrand_interface";

export default interface IZohoEmailModel {
    accountId: string;
    accountName: string;
    accountEmail: string;
    zohoId: string;
    domain: string;
    brand: Types.ObjectId | string | null | IBrand,
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    code: string;
    scope: string;
    department: Array<string>;
}