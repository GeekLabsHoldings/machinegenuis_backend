import axios from 'axios';

class ScrapeController {
    endpoints;
    axiosRequest;
    constructor() {
        this.endpoints =
            [
                "streetPoliticsCanada",
                "investocracy/NVDA",
                "investocracy/AAPL",
                "investocracy/AMD",
                "investocracy/AMZN",
                "investocracy/PLTR",
                "investocracy/TSLA"
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
            await this.axiosRequest.get(`/collect/${item}`);
        }
    }
}



export default ScrapeController