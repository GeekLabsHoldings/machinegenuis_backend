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
        const result = analysisData.map((data) => {
            return {
                openingCount: `${(data.openingCount / data.userSubscriptionCount) * 100} %`,
                clickCount: data.clickCount,
                createdAt: data.createdAt,
                userSubscriptionCount: data.userSubscriptionCount,
                email: {
                    _id: data.email._id,
                    title: data.email.title,
                    brand: data.email.brand
                }
            }
        });
        return result;
    }

}