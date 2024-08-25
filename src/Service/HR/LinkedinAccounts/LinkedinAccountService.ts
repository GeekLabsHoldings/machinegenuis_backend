import { ClientSession } from "mongoose";
import { ILinkedinUserAccount } from "../../../Controller/HR/LinkedinAccounts/ILinkedinAccountsController";
import ILinkedinAccountsModel from "../../../Model/HR/LinkedinAccounts/ILinkedinAccountsModel";
import linkedinAccountModel from "../../../Model/HR/LinkedinAccounts/LinkedInAccountsModel";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import ILinkedinAccountService from "./ILinkedinAccountsService";
import jwt from 'jsonwebtoken';
class LinkedinAccountService implements ILinkedinAccountService {
    createToken(accountInfo: ILinkedinUserAccount): string {
        const privateKey = process.env.JWT_SECRET as string;
        const { userName, password } = accountInfo;
        const token = jwt.sign({
            userName, password
        }, privateKey);
        if (!token)
            return ErrorMessages.JWT_ERROR;
        return token;
    }
    verifyToken(token: string): ILinkedinUserAccount {
        const privateKey = process.env.JWT_SECRET as string;
        const decodedToken = jwt.verify(token, privateKey) as ILinkedinUserAccount;
        return decodedToken;
    }
    async createLinkedinAccount(accountInfo: string): Promise<void> {
        const newLinkedinAccount = new linkedinAccountModel({ accountInfo });
        const result = await newLinkedinAccount.save();
        return;
    }
    async changeAccountIsBusy(_id: string, isBusy: boolean, session: ClientSession): Promise<ILinkedinAccountsModel | null> {
        const result = await linkedinAccountModel.findOneAndUpdate({ _id }, { isBusy }, { new: true, session });
        return result;
    }
    async getFreeBusyLinkedinAccounts(isBusy: boolean, session: ClientSession): Promise<ILinkedinAccountsModel[]> {
        return await linkedinAccountModel.find({ isBusy }).session(session);
    }


}

const linkedinAccountsService = new LinkedinAccountService();

export default linkedinAccountsService;