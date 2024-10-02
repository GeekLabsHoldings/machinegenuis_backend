import { Route53Domains, RegisterDomainCommand , CountryCode  } from '@aws-sdk/client-route-53-domains';
import { fromIni, fromEnv } from '@aws-sdk/credential-providers';


export interface ContactDetail {
  FirstName: string;
  LastName: string;
  ContactType: 'PERSON' | 'COMPANY';
  AddressLine1: string;
  City: string;
  State: string;
  CountryCode: CountryCode; // Now uses the correct type
  ZipCode: string;
  PhoneNumber: string;
  Email: string;
}






export default class Route53DomainChecker {
  private client: Route53Domains;

  constructor() {
    this.client = new Route53Domains({ region:process.env.AWS_REGION,
        credentials: fromEnv()  });
  }

  async isDomainAvailable(domainName: string): Promise<boolean> {
    try {
      const response = await this.client.checkDomainAvailability({
        DomainName: domainName
      });
      return response.Availability === 'AVAILABLE';
    } catch (error) {
      console.error('Error checking domain availability:', error);
      throw error;
    }
  }

  async getDomainSuggestions(domainName: string, maxSuggestions: number = 5): Promise<(string|undefined)[]|null> {
    try {
      const response = await this.client.getDomainSuggestions({
        DomainName: domainName,
        OnlyAvailable: true,
        SuggestionCount: maxSuggestions
      });
    if (response.SuggestionsList)
        return response.SuggestionsList.map((suggestion) => suggestion.DomainName) || [];
    else
        return null
    } catch (error) {
      console.error('Error getting domain suggestions:', error);
      throw error;
    }
  }



   contactDetailsExample: ContactDetail = {
    FirstName: "John",
    LastName: "Doe",
    ContactType: "PERSON",
    AddressLine1: "123 Example St",
    City: "New York",
    State: "NY",
    CountryCode: "US",
    ZipCode: "10001",
    PhoneNumber: "+1.1234567890",
    Email: "johndoe@example.com",
  };

  async  registerDomain(domainName: string,DurationInYears:number, contactDetails: ContactDetail)  {
    // Define contact details (reusing for Admin, Registrant, and Tech contacts)


    const params = {
      DomainName: domainName,
      DurationInYears: DurationInYears, // Register the domain for 1 year
      AdminContact: contactDetails, // Admin contact details
      RegistrantContact: contactDetails, // Registrant contact details
      TechContact: contactDetails, // Tech contact details
      AutoRenew: true, // Auto-renew the domain
      PrivacyProtectAdminContact: true, // Enable privacy protection for Admin contact
      PrivacyProtectRegistrantContact: true, // Enable privacy protection for Registrant contact
      PrivacyProtectTechContact: true, // Enable privacy protection for Tech contact
    };

    const command = new RegisterDomainCommand(params);

    try {
      const result = await this.client.send(command);
      console.log("Domain registration initiated successfully:", result);
      return result
    } catch (error) {
      console.error("Error registering domain:", error);
    }
  };

}