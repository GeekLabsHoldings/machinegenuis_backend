import axios from 'axios';
import { generateTitleAndArticles } from '../OpenAi Controllers/generateContent_controller';
class ScrapeController {
    endpoints;
    axiosRequest;
    newBrandsArticle;
    constructor() {
        this.endpoints =
            [
                { brandName: "investocracy", stockName: "NVDA" },
                { brandName: "investocracy", stockName: "AAPL" },
                { brandName: "investocracy", stockName: "AMD" },
                { brandName: "investocracy", stockName: "AMZN" },
                { brandName: "investocracy", stockName: "PLTR" },
                { brandName: "investocracy", stockName: "TSLA" },
                { brandName: "investocracy", stockName: "ALPHA" },
                { brandName: "streetPoliticsAfrica", stockName: "" },
                { brandName: "streetPoliticsUK", stockName: "" },
                { brandName: "streetPoliticsCanada", stockName: "" }
            ]
        this.axiosRequest = axios.create({
            baseURL: `${process.env.EC2_BACKEND_HOST}`,
            timeout: 600000,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        });
        this.newBrandsArticle = [];
    }
    async generateScraping() {
        for (const item of this.endpoints) {
            const url = item.brandName + (item.stockName ? `/${item.stockName}` : "");
            const res = await this.axiosRequest.get(`/collect/${url}`);
            console.log({ brandName: item.brandName, stockName: item.stockName, result: res.data.StartOpenAI })
            if (res.data.StartOpenAI) {
                this.newBrandsArticle.push(item);
            }
        }
    }

    async generateTitleAndArticles() {
        try {
            console.log({ res: this.newBrandsArticle });
            for (const item of this.newBrandsArticle) {
                await generateTitleAndArticles(item.brandName, item.stockName);
            }
        } catch (error) {
            console.log("error when generate title and Articles=======>", { error });
            return;
        }
    }
}



export default ScrapeController