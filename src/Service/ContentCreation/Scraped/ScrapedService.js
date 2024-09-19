import scrapedModel from "../../../Model/ContentCreation/Scraped/scraped_model";

export default class ScrapedService {
  async getScrapedUrlById(id) {
    const result = await scrapedModel.findById(id).select("url");
    return result;
  }
}
