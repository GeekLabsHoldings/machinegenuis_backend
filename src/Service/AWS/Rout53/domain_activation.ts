import {
  Route53Client,
  CreateHostedZoneCommand,
  ChangeResourceRecordSetsCommand,
  GetHostedZoneCommand,
  HostedZone,
  ResourceRecordSet,
  Change,
  ChangeResourceRecordSetsCommandInput,
  RRType,
} from "@aws-sdk/client-route-53";
import { ACMClient, RequestCertificateCommand, DescribeCertificateCommand, RequestCertificateCommandInput } from "@aws-sdk/client-acm";
import { Route53DomainsClient, GetDomainDetailCommand } from "@aws-sdk/client-route-53-domains";

interface CnameRecord {
  Name: string;
  Value: string;
}

export default class AwsDomainActivation {
  private route53: Route53Client;
  private acm: ACMClient;
  private domains: Route53DomainsClient;

  constructor() {
    this.route53 = new Route53Client();
    this.acm = new ACMClient();
    this.domains = new Route53DomainsClient();
  }

  // Step 0: Verify email
  async checkDomainVerificationStatus(domainName: string): Promise<string | undefined> {
    const params = {
      DomainName: domainName,
    };
  
    try {
      const result = await this.domains.send(new GetDomainDetailCommand(params));
      const emailVerificationStatus = result.AdminContact?.Email;
  
      console.log(`Email Verification Status: ${emailVerificationStatus}`);
      return emailVerificationStatus;
    } catch (error) {
      console.error("Error checking domain status:", error);
    }
  }

  // Step 1: Create a Hosted Zone
  async createHostedZone(domainName: string): Promise<string | undefined> {
    const params = {
      Name: domainName,
      CallerReference: `${Date.now()}`,
    };

    try {
      const result = await this.route53.send(new CreateHostedZoneCommand(params));
      console.log("Hosted zone created:", result.HostedZone);
      return result.HostedZone?.Id;
    } catch (error) {
      console.error("Error creating hosted zone:", error);
    }
  }

  // Step 2: Method to get name servers for a hosted zone
  async getNameServers(hostedZoneId: string): Promise<string[] | undefined> {
    const params = {
      Id: hostedZoneId,
    };

    try {
      const result = await this.route53.send(new GetHostedZoneCommand(params));
      const nsRecords = result.DelegationSet?.NameServers;
      console.log(`Name Servers: ${nsRecords}`);
      return nsRecords;
    } catch (error) {
      console.error("Error getting name servers:", error);
    }
  }

  // Step 3: Update Name Servers for the domain
  async updateNS(domainName: string, nameServers: string[], HostedZoneId: string): Promise<void> {
    const params: ChangeResourceRecordSetsCommandInput = {
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
      HostedZoneId: HostedZoneId || "ZXXXXXXXXXX",
    };

    try {
      const result = await this.route53.send(new ChangeResourceRecordSetsCommand(params));
      console.log("NS updated:", result);
    } catch (error) {
      console.error("Error updating NS:", error);
    }
  }

  // Step 4: Create SSL Certificate
  async requestCertificate(domainName: string): Promise<string | undefined> {
    const params:RequestCertificateCommandInput = {
      DomainName: domainName,
      SubjectAlternativeNames: [domainName, `*.${domainName}`],
      ValidationMethod: "DNS",
    };

    try {
      const result = await this.acm.send(new RequestCertificateCommand(params));
      console.log("Certificate requested:", result);
      return result.CertificateArn;
    } catch (error) {
      console.error("Error requesting certificate:", error);
    }
  }

  // Step 5: Get DNS CName Name CName value
  async getDnsValidationRecords(certificateArn: string): Promise<CnameRecord | undefined> {
    const params = {
      CertificateArn: certificateArn,
    };

    try {
      const result = await this.acm.send(new DescribeCertificateCommand(params));
      const domainValidationOptions = result.Certificate?.DomainValidationOptions;
      let cnameRecord:CnameRecord = {Name:"", Value:""};
      domainValidationOptions?.forEach((option) => {
        console.log(`Domain: ${option.DomainName}`);
        if (option.ValidationMethod === "DNS" && option.ResourceRecord) {
          const value = option.ResourceRecord.Value
          const name = option.ResourceRecord.Name
          cnameRecord.Name = String(name) 
          cnameRecord.Value = String(value) 
          console.log(`CNAME Record Name: ${option.ResourceRecord.Name}`);
          console.log(`CNAME Record Value: ${option.ResourceRecord.Value}`);
          console.log(`Validation Status: ${option.ValidationStatus}`);
        }
      });
      return cnameRecord;
    } catch (error) {
      console.error("Error getting DNS validation records:", error);
    }
  }

  // Step 6: Add CNAME for SSL validation in Hosted Zone
  async addHostedZoneRecord(domainName: string, cnameRecord: CnameRecord, HostedZoneId: string, type: RRType): Promise<void> {
    const params: ChangeResourceRecordSetsCommandInput = {
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
      HostedZoneId: HostedZoneId || "ZXXXXXXXXXX",
    };

    try {
      const result = await this.route53.send(new ChangeResourceRecordSetsCommand(params));
      console.log("CNAME for SSL added:", result);
    } catch (error) {
      console.error("Error adding CNAME:", error);
    }
  }
}

/*
// Usage
const domainManager = new AwsDomainActivation();
const domainName = "example.com";

// Optional: Check domain status
// const emailVerificationStatus = await domainManager.checkDomainVerificationStatus(domainName);

// Step 2: Create Hosted Zone
const HostedZoneId = await domainManager.createHostedZone(domainName);

if (HostedZoneId) {
  // Step 3: Update Name Servers for the domain
  const nameServers = await domainManager.getNameServers(HostedZoneId);
  if (nameServers) {
    await domainManager.updateNS(domainName, nameServers, HostedZoneId);
  }

  // Step 4: Request SSL
  const CertificateArn = await domainManager.requestCertificate(domainName);

  if (CertificateArn) {
    // Step 5: Get DNS CName Name CName value
    const cnameRecord = await domainManager.getDnsValidationRecords(CertificateArn);

    if (cnameRecord) {
      // Step 6: Add CNAME for SSL validation
      await domainManager.addHostedZoneRecord(domainName, cnameRecord, HostedZoneId, 'CNAME');
    }
  }
}
*/
