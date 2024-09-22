import IAudienceModel from "../../../Model/NewsLetter/Audience/IAudienceModel";

export default interface IAudiencesService {
    updateMonthAudience(audience: IAudienceModel): Promise<void>;
    getAudience(brand: string): Promise<IAudienceModel[]>;
}
