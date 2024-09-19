import IAnalyticsModel from "../../../Model/NewsLetter/Analytics/Analytics";
export interface IAnalysisNewsLetterServiceResponseService {
    openingCount: number;
    clickCount: number;
    createdAt: number,
    userSubscriptionCount: number,
    email: { _id: string, title: string, brand: string };
}
export default interface IAnalysisNewsLetterService {
    createNewsLetterAnalysis(data: IAnalyticsModel): Promise<void>;
    getNewsLetterAnalysis(brand: string): Promise<IAnalysisNewsLetterServiceResponseService[]>
}