export interface IAnalysisNewsLetterServiceResponse {
    openingCount: string;
    clickCount: number;
    createdAt: number;
    email: {
        _id: string;
        title: string;
        brand: string;
    }
}

export default interface IAnalysisNewsLetterController {
    createNewsLetterAnalysis(email_id: string, user_email: string, article_id: string, type: string): Promise<void>;
    getNewsLetterAnalysis(brand: string): Promise<IAnalysisNewsLetterServiceResponse[]>;
}