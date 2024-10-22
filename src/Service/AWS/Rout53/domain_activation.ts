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
import { Route53DomainsClient, GetDomainDetailCommand } from "@aws-sdk/client-route-53-domains";



interface CnameRecord {
  Name: string;
  Value: string;
}


export default class AwsDomainActivation {
  private route53: Route53Client;
  private domains: Route53DomainsClient;

  constructor() {
    this.route53 = new Route53Client();
    this.domains = new Route53DomainsClient();
  }

  // Step 0: Verify email
  async checkDomainVerificationStatus(domainName: string): Promise<string | undefined> {
    const params = {
      DomainName: domainName,
    };
  
      const result = await this.domains.send(new GetDomainDetailCommand(params));
      const emailVerificationStatus = result.AdminContact?.Email;
  
      console.log(`Email Verification Status: ${emailVerificationStatus}`);
      return emailVerificationStatus;

  }

  // Step 1: Create a Hosted Zone
  async createHostedZone(domainName: string): Promise<string | undefined> {
    const params = {
      Name: domainName,
      CallerReference: `${Date.now()}`,
    };


      const result = await this.route53.send(new CreateHostedZoneCommand(params));
      console.log("Hosted zone created:", result.HostedZone);
      return result.HostedZone?.Id;

  }

  // Step 2: Method to get name servers for a hosted zone
  async getNameServers(hostedZoneId: string): Promise<string[] | undefined> {
    const params = {
      Id: hostedZoneId,
    };

      const result = await this.route53.send(new GetHostedZoneCommand(params));
      const nsRecords = result.DelegationSet?.NameServers;
      console.log(`Name Servers: ${nsRecords}`);
      return nsRecords;

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


      const result = await this.route53.send(new ChangeResourceRecordSetsCommand(params));
      console.log("NS updated:", result);

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
