import { ACMClient, RequestCertificateCommand, DescribeCertificateCommand, RequestCertificateCommandInput } from "@aws-sdk/client-acm";





interface CnameRecord {
    Name: string;
    Value: string;
  }



export default class ACMCLIENT {
    private acm: ACMClient;
  
    constructor() {
      this.acm = new ACMClient();
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
  
}