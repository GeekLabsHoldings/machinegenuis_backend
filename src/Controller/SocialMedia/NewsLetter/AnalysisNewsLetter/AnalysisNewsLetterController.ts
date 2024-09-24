import IAnalyticsModel from "../../../../Model/NewsLetter/Analytics/Analytics";
import IAnalysisNewsLetterController, { IAnalysisNewsLetterServiceResponse } from "./IAnalysisNewsLetterController";
import moment from "../../../../Utils/DateAndTime";
import AnalysisNewsLetterService from "../../../../Service/NewsLetter/Analysis/AnalysisService";
export default class AnalysisNewsLetterController implements IAnalysisNewsLetterController {
    async createNewsLetterAnalysis(email_id: string, user_email: string, article_id: string, type: string): Promise<void> {
        const data: IAnalyticsModel = {
            email: email_id,
            userEmail: user_email,
            type: type,
            article_id: article_id,
            createdAt: moment().valueOf()
        }
        const analysisService = new AnalysisNewsLetterService();
        await analysisService.createNewsLetterAnalysis(data);
    }

    async getNewsLetterAnalysis(brand: string): Promise<IAnalysisNewsLetterServiceResponse[]> {
        const analysisService = new AnalysisNewsLetterService();
        const analysisData = await analysisService.getNewsLetterAnalysis(brand);

        const result: IAnalysisNewsLetterServiceResponse[] = [];
        analysisData.forEach((data) => {
            const percentage = parseFloat(((data.openingCount / data.userSubscriptionCount) * 100).toFixed(2));
            const month = moment(data.createdAt).format("YYYY-MMMM");
            if (result.length === 0 || result[result.length - 1].MonthAnalysis !== month) {
                result.push({
                    MonthAnalysis: month,
                    result: []
                });
            }
            result[result.length - 1].result.push({
                openingCount: `${percentage}%`,
                clickCount: data.clickCount,
                createdAt: data.createdAt,
                userSubscriptionCount: data.userSubscriptionCount,
                email: {
                    _id: data.email._id,
                    title: data.email.title,
                    brand: data.email.brand
                }
            });
        });
        return result;
    }

}