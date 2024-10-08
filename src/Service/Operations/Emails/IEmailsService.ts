import IZohoEmailModel from "../../../Model/Zoho/Emails/IZohoEmails";

export default interface IUserEmailService {
    addNewUserEmail(userData: IZohoEmailModel): Promise<IZohoEmailModel>;
    getUserEmailData(brand: string | null, department: string | null): Promise<IZohoEmailModel[]>;
}