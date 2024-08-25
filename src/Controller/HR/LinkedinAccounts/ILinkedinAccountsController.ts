import { ClientSession } from "mongoose";

export interface ILinkedinUserAccount {
    userName: string,
    password: string
}
export default interface ILinkedinAccountController {
    createAccount(accountInfo: ILinkedinUserAccount): Promise<string>;
    getOneFreeAccounts(session: ClientSession): Promise<ILinkedinUserAccount & { _id: string } | null>
    changeAccountIsBusy(accountId: string, isBusy: boolean, session: ClientSession): Promise<boolean>
}