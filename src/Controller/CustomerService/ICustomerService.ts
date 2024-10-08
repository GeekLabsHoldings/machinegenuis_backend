import { IAllEmailData, IEmailData } from "../../Service/Zoho/Emails/IEmailZohoService";

export default interface ICustomerServiceController {
    sendEmail(department: string | null, brandId: string | null, toAddress: string, subject: string, content: string): Promise<string>;
    replayEmail(department: string | null, brandId: string | null, emailId: string, toAddress: string, subject: string, content: string): Promise<string>;
    getAllEmails(department: string | null, brandId: string | null): Promise<IAllEmailData[]>;
    getEmailById(department: string | null, brandId: string | null, emailId: string, folderId: string): Promise<IEmailData>;

}