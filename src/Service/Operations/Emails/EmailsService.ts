import IZohoEmailModel from "../../../Model/Zoho/Emails/IZohoEmails";
import ZohoEmailsModel from "../../../Model/Zoho/Emails/ZohoEmails";
import IUserEmailService from "./IEmailsService";

export default class UserEmailService implements IUserEmailService {
    async addNewUserEmail(userData: IZohoEmailModel): Promise<IZohoEmailModel> {
        const newUserEmail = new ZohoEmailsModel(userData);
        const result = await newUserEmail.save();
        return result;
    }

    async getUserEmailData(brand: string | null, department: string | null): Promise<IZohoEmailModel[]> {
        const query = (brand && department) ? { brand, department } : (brand) ? { brand } : (department) ? { department } : {};
        const result = await ZohoEmailsModel.find(query);
        return result;
    }
} 