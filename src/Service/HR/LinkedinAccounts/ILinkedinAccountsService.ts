import { Types } from "mongoose";
export interface ILinkedinAccountCookiesModel {
    _id: Types.ObjectId | string;
    cookies: Array<object>;
    email: string;
    password: string;
    isBusy: boolean;
}
export default interface ILinkedinAccountsService {
    getBusyAccounts(): Promise<ILinkedinAccountCookiesModel[]>;
}