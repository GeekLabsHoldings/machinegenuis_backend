import { Types } from "mongoose";
import LinkedinAccountCookiesModel from "../../../Model/HR/LinkedinAccounts/LinkedinAccountCookiesModel";
import ILinkedinAccountsService, { ILinkedinAccountCookiesModel } from "./ILinkedinAccountsService";

export default class LinkedinAccountService implements ILinkedinAccountsService {
    public async getBusyAccounts(): Promise<ILinkedinAccountCookiesModel[]> {
        return await LinkedinAccountCookiesModel.find({ isBusy: true });
    }
}