import UserZohoService from "../UserAndOrganization/UserAndOrganization";
import IDomainZohoService from "./IDomainZohoService";

export default class DomainZohoService extends UserZohoService implements IDomainZohoService {
    constructor(client_id: string, client_secret: string, refreshAccessToken: string, organizationId: string) {
        super(client_id, client_secret, refreshAccessToken, organizationId)
    }
    async addNewDomain(domainName: string): Promise<string> {
        const result = await this.axiosSetup.post(`/organization/${this.organizationId}/domains`, { domainName });
        return domainName;
    }

    async checkMXVerified(domainName: string): Promise<object> {
        const result = await this.axiosSetup.get(`/organization/${this.organizationId}/domains/${domainName}`);
        return result.data;
    }


}