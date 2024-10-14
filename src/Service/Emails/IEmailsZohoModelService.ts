import { Types } from "mongoose";
import IZohoEmailModel from "../../Model/Zoho/Emails/IZohoEmails";

export default interface IEmailsZohoModelService {
    addEmailAccount(emailAccount: IZohoEmailModel): Promise<IZohoEmailModel>;
    addEmailDeveloperAccount(_id: string, emailAccount: IZohoEmailModel): Promise<IZohoEmailModel | null>;
    getEmailAccount(department: string | null, brand: string | null): Promise<IZohoEmailModel & { _id: Types.ObjectId } | null>;
    updateAccessToken(_id: string, accessToken: string,  refreshToken: string, expiredIn: number , clientId?:string, clientSecret?:string,): Promise<IZohoEmailModel | null>;
    getMainAccount (): Promise<IZohoEmailModel | null>;
    getEmailAccounts():Promise<IZohoEmailModel[] | []>;
    getEmailAccountByIDorEmail(acc_id:string, email:string): Promise<IZohoEmailModel | null>
}