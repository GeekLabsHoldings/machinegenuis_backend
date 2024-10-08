import UserZohoService from "../UserAndOrganization/UserAndOrganization";
import IZohoEmailService, { IAllEmailData, IEmailData, ISendEmailData } from "./IEmailZohoService";

export default class EmailZohoService extends UserZohoService implements IZohoEmailService {
    constructor(client_id: string, client_secret: string, refreshAccessToken: string, organizationId: string) {
        super(client_id, client_secret, refreshAccessToken, organizationId);
    }

    async sendEmail(emailData: ISendEmailData, accountId: string): Promise<string> {
        const result = await this.axiosSetup.post(`/accounts/${accountId}/messages`, emailData);
        return result.data;
    }

    async replayEmail(emailData: ISendEmailData, emailId: string, action: string = 'reply', accountId: string): Promise<string> {
        const body = {
            ...emailData,
            action,
        }
        console.log(body);

        const result = await this.axiosSetup.post(`/accounts/${accountId}/messages/${emailId}`, body);
        return result.data;
    }

    async getAllEmails(accountId: string): Promise<IAllEmailData[]> {
        const result = await this.axiosSetup.get(`/accounts/${accountId}/messages/view`);
        return result.data;
    }

    async getEmailById(accountId: string, folderId: string, emailId: string): Promise<IEmailData> {
        const result = await this.axiosSetup.get(`/accounts/${accountId}/folders/${folderId}/messages/${emailId}/content`);
        return result.data;
    }
}