import {
  Route53Client,
  CreateHostedZoneCommand,
  ChangeResourceRecordSetsCommand,
} from "@aws-sdk/client-route-53";
import { ACMClient, RequestCertificateCommand } from "@aws-sdk/client-acm";
import {Route53DomainsClient,} from "@aws-sdk/client-route-53-domains";

export default class AwsDomainActivation {
  constructor() {
    this.route53 = new Route53Client();
    this.acm = new ACMClient();
    this.domains = new Route53DomainsClient();
  }

  // Step 0: varify email
  async checkDomainVerificationStatus(domainName) {
    const params = {
      DomainName: domainName, // The domain you're checking
    };
  
    try {
      const result = await this.route53.send(new GetDomainDetailCommand(params));
      const status = result.Status; // Domain status (like 'REGISTERED')
      const emailVerificationStatus = result.AdminContact.Email;
  
      console.log(`Domain: ${domainName}, Status: ${status}`);
      console.log(`Email Verification Status: ${emailVerificationStatus}`);
      return emailVerificationStatus
    } catch (error) {
      console.error("Error checking domain status:", error);
    }
  }

  // Step 1: Create a Hosted Zone
  async createHostedZone(domainName) {
    const params = {
      Name: domainName,
      CallerReference: `${Date.now()}`, // Unique reference
    };

    try {
      const result = await this.route53.send(
        new CreateHostedZoneCommand(params)
      );
      console.log("Hosted zone created:", result.HostedZone);
      return result.HostedZone.Id;
    } catch (error) {
      console.error("Error creating hosted zone:", error);
    }
  }

  //Step 2: Method to get name servers for a hosted zone
  async getNameServers(hostedZoneId) {
    const params = {
      Id: hostedZoneId, // The ID of the hosted zone
    };

    try {
      const result = await this.route53.send(new GetHostedZoneCommand(params));
      const nsRecords = result.DelegationSet.NameServers; // List of name servers
      console.log(`Name Servers: ${nsRecords}`);
      return nsRecords;
    } catch (error) {
      console.error("Error getting name servers:", error);
    }
  }

  // Step 3: Update Name Servers for the domain
  async updateNS(domainName, nameServers, HostedZoneId) {
    const params = {
      ChangeBatch: {
        Changes: [
          {
            Action: "UPSERT",
            ResourceRecordSet: {
              Name: domainName,
              Type: "NS",
              TTL: 300,
              ResourceRecords: nameServers.map((ns) => ({ Value: ns })),
            },
          },
        ],
      },
      HostedZoneId: HostedZoneId || "ZXXXXXXXXXX", // Hosted Zone ID
    };

    try {
      const result = await this.route53.send(
        new ChangeResourceRecordSetsCommand(params)
      );
      console.log("NS updated:", result);
    } catch (error) {
      console.error("Error updating NS:", error);
    }
  }

  // Step 4: Create SSL Certificate
  async requestCertificate(domainName) {
    const params = {
      DomainName: domainName,
      SubjectAlternativeNames: [domainName, `*.${domainName}`], // Wildcard
      ValidationMethod: "DNS", // DNS validation
    };

    try {
      const result = await this.acm.send(new RequestCertificateCommand(params));
      console.log("Certificate requested:", result);
      return result.CertificateArn;
    } catch (error) {
      console.error("Error requesting certificate:", error);
    }
  }
  //Step 5:  get DNS CName Name CName value 

  async getDnsValidationRecords(certificateArn) {
    const params = {
      CertificateArn: certificateArn, // The ARN of the certificate
    };

    try {
      const result = await this.acm.send(new DescribeCertificateCommand(params));
      const domainValidationOptions = result.Certificate.DomainValidationOptions;
      const cnameRecord = {}
      domainValidationOptions.forEach((option) => {
        console.log(`Domain: ${option.DomainName}`);
        if (option.ValidationMethod === "DNS") {
          cnameRecord[option.ResourceRecord.Name] = option.ResourceRecord.Value
          console.log(`CNAME Record Name: ${option.ResourceRecord.Name}`);
          console.log(`CNAME Record Value: ${option.ResourceRecord.Value}`);
          console.log(`Validation Status: ${option.ValidationStatus}`);
        }
      });
      return cnameRecord
    } catch (error) {
      console.error("Error getting DNS validation records:", error);
    }
  }


  // Step 6: Add CNAME for SSL validation in Hosted Zone
  async addHostedZoneRecord(domainName, cnameRecord, HostedZoneId,type) {
    const params = {
      ChangeBatch: {
        Changes: [
          {
            Action: "UPSERT",
            ResourceRecordSet: {
              Name: cnameRecord.Name,
              Type: type,
              TTL: 300,
              ResourceRecords: [{ Value: cnameRecord.Value }],
            },
          },
        ],
      },
      HostedZoneId: HostedZoneId || "ZXXXXXXXXXX", // Hosted Zone ID
    };

    try {
      const result = await this.route53.send(
        new ChangeResourceRecordSetsCommand(params)
      );
      console.log("CNAME for SSL added:", result);
    } catch (error) {
      console.error("Error adding CNAME:", error);
    }
  }
}

/*
// Usage
const domainManager = new AwsDomainManager();
const domainName = "example.com";


optional // backend => check domain status 


// Step 2: Create Hosted Zone
HostedZoneId = domainManager.createHostedZone(domainName);


// Step 3: Update Name Servers for the domain
nameServers = getNameServers(hostedZoneId)
domainManager.updateNS(domainName, nameServers, HostedZoneId);



// Step 4: Request SSL
CertificateArn = domainManager.requestCertificate(domainName);


//Step 5:  get DNS CName Name CName value 
cnameRecord = getDnsValidationRecords(certificateArn)




// Step 6: Add CNAME for SSL validation (Use the response from ACM for the CNAME details)
domainManager.addSSLCNAME(domainName, cnameRecord, HostedZoneId);
*/
