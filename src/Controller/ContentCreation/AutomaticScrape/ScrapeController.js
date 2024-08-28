import axios from 'axios';
import { generateTitleAndArticles } from '../OpenAi Controllers/generateContent_controller';
class ScrapeController {
    endpoints;
    axiosRequest;
    constructor() {
        this.endpoints =
            [
                { brandName: "streetPoliticsCanada", stockName: "" },
                { brandName: "investocracy", stockName: "NVDA" },
                { brandName: "investocracy", stockName: "AAPL" },
                { brandName: "investocracy", stockName: "AMD" },
                { brandName: "investocracy", stockName: "AMZN" },
                { brandName: "investocracy", stockName: "PLTR" },
                { brandName: "investocracy", stockName: "TSLA" }
            ]
        this.axiosRequest = axios.create({
            baseURL: `${process.env.EC2_BACKEND_HOST}`,
            timeout: 600000,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        });
    }
    async generateScraping() {
        for (const item of this.endpoints) {
            const url = item.brandName + (item.stockName ? `/${item.stockName}` : "");
            const res = await this.axiosRequest.get(`/collect/${url}`);
            console.log({ result: res.data.StartOpenAI })
            if (res.data.StartOpenAI) {
                await generateTitleAndArticles(item.brandName, item.stockName);
            }
        }
    }
}



export default ScrapeController