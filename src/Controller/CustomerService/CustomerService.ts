import { Types } from "mongoose";
import IZohoEmailModel from "../../Model/Zoho/Emails/IZohoEmails";
import EmailsZohoModelService from "../../Service/Emails/EmailsZohoModelService";
import EmailZohoService from "../../Service/Zoho/Emails/EmailZohoService";
import { IAllEmailData, IEmailData, ISendEmailData } from "../../Service/Zoho/Emails/IEmailZohoService";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import ICustomerServiceController from "./ICustomerService";

export default class CustomerServiceController implements ICustomerServiceController {

    async getAccountEmail(department: string | null, brandId: string | null): Promise<IZohoEmailModel & { _id: Types.ObjectId }> {
        const emailsZohoModelService = new EmailsZohoModelService();
        const senderAccount = await emailsZohoModelService.getEmailAccount(department, brandId);
        if (!senderAccount) {
            return systemError.setStatus(404).setMessage(ErrorMessages.INVALID_EMAILS).throw();
        }
        return senderAccount;
    }

    async setAccountAccessToken(senderAccount: IZohoEmailModel & { _id: Types.ObjectId }) {
        const emailsZohoModelService = new EmailsZohoModelService();
        const { _id, accountId, accessToken, expiredIn, clientId, clientSecret, refreshToken, zohoId } = senderAccount;
        const zohoEmailService = new EmailZohoService(accountId, clientId, clientSecret, zohoId);
        console.log("Expired In", expiredIn);
        if (!expiredIn || expiredIn <= new Date().valueOf()) {
            console.log("Enter Here");
            const accessToken = await zohoEmailService.generateAccessToken(refreshToken);
            const expire = new Date().valueOf() + 3600000;
            await emailsZohoModelService.updateAccessToken((_id.toString()), accessToken,"", expire);
        }
        else {
            console.log("Set Access Token");
            await zohoEmailService.setAccessToken(accessToken);
        }

        return zohoEmailService;
    }
    async sendEmail(department: string | null, brandId: string | null, toAddress: string, subject: string, content: string): Promise<string> {
        const senderAccount = await this.getAccountEmail(department, brandId);
        const { accountEmail } = senderAccount;
        const zohoEmailService = await this.setAccountAccessToken(senderAccount);
        const emailData: ISendEmailData = {
            fromAddress: accountEmail,
            toAddress,
            subject,
            content,
            askReceipt: 'yes'
        }
        const result = await zohoEmailService.sendEmail(emailData);
        return result;
    }
    async replayEmail(department: string | null, brandId: string | null, emailId: string, toAddress: string, subject: string, content: string): Promise<string> {
        const senderAccount = await this.getAccountEmail(department, brandId);
        const { accountEmail } = senderAccount;
        const zohoEmailService = await this.setAccountAccessToken(senderAccount);
        const emailData: ISendEmailData = {
            fromAddress: accountEmail,
            toAddress,
            subject,
            content,
            askReceipt: 'yes'
        }
        const result = await zohoEmailService.replayEmail(emailData, emailId, 'reply');
        return result;
    }
    async getAllEmails(department: string | null, brandId: string | null): Promise<IAllEmailData[]> {
        const senderAccount = await this.getAccountEmail(department, brandId);
        const zohoEmailService = await this.setAccountAccessToken(senderAccount);
        const result = await zohoEmailService.getAllEmails();
        return result;
    }
    async getEmailById(department: string | null, brandId: string | null, emailId: string, folderId: string): Promise<IEmailData> {
        const senderAccount = await this.getAccountEmail(department, brandId);
        const zohoEmailService = await this.setAccountAccessToken(senderAccount);
        const content= await zohoEmailService.getEmailById(folderId, emailId);
        const header = await zohoEmailService.getEmailHeaders(folderId, emailId);
        return {messageId: emailId, content: content.content, header};
    }

    async deleteEmail(department: string | null, brandId: string | null, emailId: string, folderId: string): Promise<string> {
        const senderAccount = await this.getAccountEmail(department, brandId);
        const zohoEmailService = await this.setAccountAccessToken(senderAccount);
        const result = await zohoEmailService.deleteEmail(folderId, emailId);
        return result;
    }


}