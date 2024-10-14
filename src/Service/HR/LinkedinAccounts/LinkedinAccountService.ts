import { Types } from "mongoose";
import ILinkedinAccountCookiesModel from "../../../Model/HR/LinkedinAccounts/ILinkedinAccountCookiesModel";
import LinkedinAccountCookiesModel from "../../../Model/HR/LinkedinAccounts/LinkedinAccountCookiesModel";
import ILinkedinAccountsService from "./ILinkedinAccountsService";

export default class LinkedinAccountService implements ILinkedinAccountsService {
    public async getBusyAccounts(): Promise<(ILinkedinAccountCookiesModel & { _id: Types.ObjectId | string })[]> {
        return await LinkedinAccountCookiesModel.find({ isBusy: true });
    }
}