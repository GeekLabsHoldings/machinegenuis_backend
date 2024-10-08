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

    async getEmailAccount(department: string | null, brand: string | null): Promise<IZohoEmailModel | null> {
        const query = (department && brand) ? { department, brand } : (department) ? { department } : (brand) ? { brand } : {};
        const result = await ZohoEmailsModel.findOne(query);
        return result;
    }

}