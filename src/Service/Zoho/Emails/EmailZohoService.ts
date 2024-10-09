import UserZohoService from "../UserAndOrganization/UserAndOrganization";
import IZohoEmailService, { IAllEmailData, IEmailData, ISendEmailData } from "./IEmailZohoService";

export default class EmailZohoService extends UserZohoService implements IZohoEmailService {
    accountId: string;
    constructor(accountId: string, client_id: string, client_secret: string, organizationId: string) {
        super(client_id, client_secret, organizationId);
        this.accountId = accountId;
    }

    async sendEmail(emailData: ISendEmailData,): Promise<string> {
        const result = await this.axiosSetup.post(`/accounts/${this.accountId}/messages`, emailData);
        return result.data;
    }

    async replayEmail(emailData: ISendEmailData, emailId: string, action: string = 'reply',): Promise<string> {
        const body = {
            ...emailData,
            action,
        }
        console.log(body);

        const result = await this.axiosSetup.post(`/accounts/${this.accountId}/messages/${emailId}`, body);
        return result.data;
    }

    async getAllEmails(): Promise<IAllEmailData[]> {
        const result = await this.axiosSetup.get(`/accounts/${this.accountId}/messages/view`);
        return result.data;
    }

    async getEmailById(folderId: string, emailId: string): Promise<IEmailData> {
        const result = await this.axiosSetup.get(`/accounts/${this.accountId}/folders/${folderId}/messages/${emailId}/content`);
        return result.data.data;
    }

    async getEmailHeaders(folderId: string, messageId: string): Promise<object> {
        const result = await this.axiosSetup.get(`/accounts/${this.accountId}/folders/${folderId}/messages/${messageId}/details`);
        return result.data.data;
    }

    async deleteEmail(folderId: string, messageId: string): Promise<string> {
        const result = await this.axiosSetup.delete(`/accounts/${this.accountId}/folders/${folderId}/messages/${messageId}`);
        return result.data.status.description;
    }



}