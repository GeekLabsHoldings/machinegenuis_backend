export interface IGrowthPercentage {
    PublishedNewsLetter: { this_month: number, last_month: number },
    GrowthPercentage: { this_month: string, last_month: string },
    NewSubscribers: { this_month: number, last_month: number },
    UnSubscribers: { this_month: number, last_month: number }
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
    getAudiencesAnalysisChart(brand: string, year: number): Promise<Array<number>>;
    getGrowthPercentage(brand: string): Promise<IGrowthPercentage>;
    getAudiencesEmails(brand: string, queryType: string): Promise<IAudienceAnalysisResponse[]>;
}
