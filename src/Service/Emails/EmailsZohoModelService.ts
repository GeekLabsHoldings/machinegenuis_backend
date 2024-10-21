import { Types } from "mongoose";
import IZohoEmailModel from "../../Model/Zoho/Emails/IZohoEmails";
import ZohoEmailsModel from "../../Model/Zoho/Emails/ZohoEmails";
import IEmailsZohoModelService from "./IEmailsZohoModelService";

export default class EmailsZohoModelService implements IEmailsZohoModelService {
    async addEmailAccount(emailAccount: IZohoEmailModel): Promise<IZohoEmailModel> {
        const newEmailAccount = new ZohoEmailsModel(emailAccount);
        const result = await newEmailAccount.save();
        return result;
    }

    async addEmailDeveloperAccount(_id: string, emailAccount: IZohoEmailModel): Promise<IZohoEmailModel | null> {
        const result = await ZohoEmailsModel.findByIdAndUpdate(_id, emailAccount, { new: true });
        return result;
    }

    async getEmailAccount(department: string | null, brand: string | null): Promise<IZohoEmailModel & { _id: Types.ObjectId } | null> {
        const query = (department && brand) ? { department, brand } : (department) ? { department } : (brand) ? { brand } : {};
        const result = await ZohoEmailsModel.findOne(query);
        return result;
    }

    async getEmailAccounts() {
        const result = await ZohoEmailsModel.find({});
        return result;
    }

    async getEmailAccountByIDorEmail(acc_id:string|null|undefined , email:string): Promise<IZohoEmailModel & { _id: Types.ObjectId } | null> {
        const query = (acc_id) ? { _id:acc_id } : {accountEmail: email }
        const result = await ZohoEmailsModel.findOne(query);
        return result;
    }


    async updateAccessToken(_id: string, accessToken: string, expiredIn: number,  ): Promise<IZohoEmailModel & { _id: Types.ObjectId }  | null> {
        const result = await ZohoEmailsModel.findByIdAndUpdate(_id, { accessToken,  expiredIn }, { new: true });
        return result;
    }
    async updateAccessAndRefreshToken(_id: string, accessToken: string, refreshToken: string, expiredIn: number,  clientId:string, clientSecret:string, ): Promise<IZohoEmailModel | null> {
        const result = await ZohoEmailsModel.findByIdAndUpdate(_id, { accessToken, refreshToken, clientId, clientSecret,  expiredIn }, { new: true });
        return result;
    }

    async getMainAccount (): Promise<IZohoEmailModel & { _id: Types.ObjectId }  | null> {
        const mainAccount = await ZohoEmailsModel.findOne({isAdminAccount:true})
        return mainAccount
    }

}