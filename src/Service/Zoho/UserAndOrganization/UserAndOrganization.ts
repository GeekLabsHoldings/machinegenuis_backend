import axios, { Axios } from "axios";
import IUserZohoService, { ICreateUserBody } from "./IUserZohoService";
import ZohoEmailsModel from "../../../Model/Zoho/Emails/ZohoEmails";

export default class UserZohoService implements IUserZohoService {
    axiosSetup: Axios;
    client_id: string;
    client_secret: string;
    refreshAccessToken: string;
    organizationId: string;
    constructor(client_id: string, client_secret: string, refreshAccessToken: string, organizationId: string) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.refreshAccessToken = refreshAccessToken;
        this.organizationId = organizationId;
        this.axiosSetup = axios.create({
            baseURL: "https://mail.zoho.com/api",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        });
    }
    async generateAccessToken(): Promise<void> {
        const result = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
            params: {
                client_id: this.client_id,
                grant_type: 'refresh_token',
                client_secret: this.client_secret,
                refresh_token: this.refreshAccessToken
            }
        });
        const accessToken = result.data.access_token;
        this.axiosSetup.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }

    async addNewUser(userData: ICreateUserBody): Promise<ICreateUserBody> {
        const result = await this.axiosSetup.post(`/organization/${this.organizationId}/accounts`, userData);
        return result.data;
    }
}