export interface IAudienceResponse {
    result: { year: string, month: string, count: number }[],
    analysis: {
        PublishedNewsLetter: { this_month: number, last_month: number },
        GrowthPercentage: { this_month: number, last_month: number },
        NewSubscribers: { this_month: number, last_month: number },
        UnSubscribers: { this_month: number, last_month: number }
    }
}

export interface IAudienceAnalysisResponse {
    email: string,
    contactRating: number,
    brand: string,
    subscription: boolean,
    createdAt: number
}
export default interface IAudienceController {
    addNewUser(email: string, brand: string): Promise<void>;
    unSubscribeUser(email: string, brand: string): Promise<void>;
    getAllUsers(brand: string): Promise<string[]>;
    getAudiencesAnalysis(brand: string): Promise<IAudienceResponse>;
    getAudiencesEmails(brand: string, queryType: string): Promise<IAudienceAnalysisResponse[]>;
}
