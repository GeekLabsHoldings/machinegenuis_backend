const {
    CheckDomainAvailabilityCommand,
    GetDomainSuggestionsCommand,
    ListPricesCommand,
    Route53Domains
  } = require("@aws-sdk/client-route-53-domains");
  import { Route53Domains, RegisterDomainCommand , CountryCode  } from '@aws-sdk/client-route-53-domains';
  import { fromIni, fromEnv } from '@aws-sdk/credential-providers';
  var route53 = new Route53Domains({ region:process.env.AWS_REGION,
    credentials: fromEnv()  });


  import { fromIni, fromEnv } from '@aws-sdk/credential-providers';
  const supportedTLDs = new Set([
    "com",
    "net",
    "org",
    "info",
    "biz",
    "us",
    "co",
    "io",
    "xyz",
    "fun",
    "tech"
  ]);
  
  const tldPriceCache = new Map();
  const domainAvailabilityCache = new Map();
  
  function getTLD(domain) {
    const domainParts = domain.split(".");
    return domainParts.pop();
  }
  
  function isSupportedTLD(tld) {
    return supportedTLDs.has(tld);
  }
  
  async function getDomainPrice(tld) {
    if (tldPriceCache.has(tld)) {
      // console.log(`Using cached price for .${tld}`);
      return tldPriceCache.get(tld);
    }
  
    try {
      const pricesCommand = new ListPricesCommand({ Tld: tld });
      const pricesResponse = await route53.send(pricesCommand);
      const priceInfo = pricesResponse.Prices[0];
  
      const priceData = {
        registrationPrice: priceInfo.RegistrationPrice,
        renewalPrice: priceInfo.RenewalPrice,
      };
  
      tldPriceCache.set(tld, priceData);
      // console.log(`Fetched and cached price for .${tld}`);
      return priceData;
    } catch (error) {
      console.error(`Error fetching prices for .${tld}:`, error);
      throw new Error(`Could not fetch price for .${tld} domain.`);
    }
  }
  
export  async function checkDomainExists(domain) {
    const domainTLD = getTLD(domain);
  
    if (!isSupportedTLD(domainTLD)) {
      throw new Error(`The TLD .${domainTLD} is not supported`);
    }
  
    if (domainAvailabilityCache.has(domain)) {
      console.log(`Using cached availability for ${domain}`);
      return domainAvailabilityCache.get(domain);
    }
  
    try {
      const availabilityCommand = new CheckDomainAvailabilityCommand({
        DomainName: domain,
      });
      const availabilityResponse = await route53.send(availabilityCommand);
  
      let result;
  
      if (availabilityResponse.Availability === "AVAILABLE") {
        const prices = await getDomainPrice(domainTLD);
        result = {
          available: true,
          prices,
          message: `Domain ${domain} is available`,
        };
      } else {
        const suggestionsCommand = new GetDomainSuggestionsCommand({
          DomainName: domain,
          OnlyAvailable: true,
          SuggestionCount: 20,
        });
        const suggestionsResponse = await route53.send(suggestionsCommand);
  
        const suggestionsWithPrices = await Promise.allSettled(
          (suggestionsResponse.SuggestionsList || []).map(async (suggestion) => {
            const suggestionTLD = getTLD(suggestion.DomainName);
            if (isSupportedTLD(suggestionTLD)) {
              const prices = await getDomainPrice(suggestionTLD);
              return { DomainName: suggestion.DomainName, prices };
            }
          })
        );
  
        result = {
          available: false,
          suggestions: suggestionsWithPrices
            .filter(({ status }) => status === "fulfilled")
            .map(({ value }) => value),
        };
      }
  
      domainAvailabilityCache.set(domain, result);
      return result;
    } catch (error) {
      console.error("Error checking domain availability:", error);
      throw error;
    }
  }