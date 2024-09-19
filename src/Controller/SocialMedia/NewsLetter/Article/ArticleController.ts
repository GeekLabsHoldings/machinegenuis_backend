import ScrapedService from "../../../../Service/ContentCreation/Scraped/ScrapedService";
import IArticleController from "./IArticleController";

export default class ArticleController implements IArticleController {
    async getArticleById(article_id: string): Promise<string> {
        const articleService = new ScrapedService();
        const result = await articleService.getScrapedUrlById(article_id);
        if (!result)
            return "https://www.machinegenius.io";
        return result.url || "https://www.machinegenius.io";
    }
}