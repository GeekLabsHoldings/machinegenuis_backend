import { ClientSession } from "mongoose";
import { ILinkedinUserAccount } from "../../../Controller/HR/LinkedinAccounts/ILinkedinAccountsController";
import ILinkedinAccountsModel from "../../../Model/HR/LinkedinAccounts/ILinkedinAccountsModel";

export default interface ILinkedinAccountService {
    createToken(accountInfo: ILinkedinUserAccount): string;
    verifyToken(token: string): ILinkedinUserAccount;
    createLinkedinAccount(accountInfo: string): Promise<void>;
    changeAccountIsBusy(_id: string, isBusy: boolean, session: ClientSession): Promise<ILinkedinAccountsModel | null>;
    getFreeBusyLinkedinAccounts(isBusy: boolean, session: ClientSession): Promise<ILinkedinAccountsModel[]>;
}