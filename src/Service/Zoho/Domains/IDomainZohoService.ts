export default interface IDomainZohoService {
    addNewDomain(domainName:string): Promise<string>;
}