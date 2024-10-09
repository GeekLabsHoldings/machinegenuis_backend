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
        const { _id, accessToken, expiredIn, clientId, clientSecret, refreshToken, zohoId } = senderAccount;
        const zohoEmailService = new EmailZohoService(clientId, clientSecret, zohoId);
        console.log("Expired In", expiredIn);
        if (!expiredIn || expiredIn <= new Date().valueOf()) {
            console.log("Enter Here");
            const accessToken = await zohoEmailService.generateAccessToken(refreshToken);
            const expire = new Date().valueOf() + 3600000;
            await emailsZohoModelService.updateAccessToken((_id.toString()), accessToken, expire);
        }
        else {
            console.log("Set Access Token");
            await zohoEmailService.setAccessToken(accessToken);
        }

        return zohoEmailService;
    }
    async sendEmail(department: string | null, brandId: string | null, toAddress: string, subject: string, content: string): Promise<string> {
        const senderAccount = await this.getAccountEmail(department, brandId);
        const { accountEmail, accountId } = senderAccount;
        const zohoEmailService = await this.setAccountAccessToken(senderAccount);
        const emailData: ISendEmailData = {
            fromAddress: accountEmail,
            toAddress,
            subject,
            content,
            askReceipt: 'yes'
        }
        const result = await zohoEmailService.sendEmail(emailData, accountId);
        return result;
    }
    async replayEmail(department: string | null, brandId: string | null, emailId: string, toAddress: string, subject: string, content: string): Promise<string> {
        const senderAccount = await this.getAccountEmail(department, brandId);
        const { accountEmail, accountId } = senderAccount;
        const zohoEmailService = await this.setAccountAccessToken(senderAccount);
        const emailData: ISendEmailData = {
            fromAddress: accountEmail,
            toAddress,
            subject,
            content,
            askReceipt: 'yes'
        }
        const result = await zohoEmailService.replayEmail(emailData, emailId, 'reply', accountId);
        return result;
    }
    async getAllEmails(department: string | null, brandId: string | null): Promise<IAllEmailData[]> {
        const senderAccount = await this.getAccountEmail(department, brandId);
        const { accountEmail, accountId } = senderAccount;
        const zohoEmailService = await this.setAccountAccessToken(senderAccount);
        const result = await zohoEmailService.getAllEmails(accountId);
        return result;
    }
    async getEmailById(department: string | null, brandId: string | null, emailId: string, folderId: string): Promise<IEmailData> {
        const senderAccount = await this.getAccountEmail(department, brandId);
        const { accountEmail, accountId } = senderAccount;
        const zohoEmailService = await this.setAccountAccessToken(senderAccount);
        const result = await zohoEmailService.getEmailById(accountId, folderId, emailId);
        return result;
    }


}