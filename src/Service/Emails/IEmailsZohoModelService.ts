import { Types } from "mongoose";
import IZohoEmailModel from "../../Model/Zoho/Emails/IZohoEmails";

export default interface IEmailsZohoModelService {
    addEmailAccount(emailAccount: IZohoEmailModel): Promise<IZohoEmailModel>;
    addEmailDeveloperAccount(_id: string, emailAccount: IZohoEmailModel): Promise<IZohoEmailModel | null>;
    getEmailAccount(department: string | null, brand: string | null): Promise<IZohoEmailModel & { _id: Types.ObjectId } | null>;
    updateAccessToken(_id: string, accessToken: string, expiredIn: number): Promise<IZohoEmailModel | null>;
}