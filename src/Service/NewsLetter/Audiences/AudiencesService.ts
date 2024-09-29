import AudienceModel from "../../../Model/NewsLetter/Audience/AudienceModel";
import IAudienceModel from "../../../Model/NewsLetter/Audience/IAudienceModel";
import IAudiencesService from "./IAudiencesService";

export default class AudiencesService implements IAudiencesService {
    async updateMonthAudience(audience: IAudienceModel): Promise<void> {
        await AudienceModel.findOneAndUpdate({ brand: audience.brand, date: audience.date }, {
            $set: {
                $inc: { count: audience.count || 1 },
            }
        }, { upsert: true, new: true });
    }

    async getAudience(brand: string, date: number): Promise<IAudienceModel[]> {
        return await AudienceModel.find({ brand: brand, date: { $gte: date } });
    }
}