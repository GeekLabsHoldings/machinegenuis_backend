import { Types } from "mongoose";
import ILinkedinAccountCookiesModel from "../../../Model/HR/LinkedinAccounts/ILinkedinAccountCookiesModel";

export default interface ILinkedinAccountsService {
    getBusyAccounts(): Promise<(ILinkedinAccountCookiesModel & { _id: Types.ObjectId | string })[]>;
}