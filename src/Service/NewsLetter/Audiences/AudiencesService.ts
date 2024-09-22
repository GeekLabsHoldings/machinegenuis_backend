import AudienceModel from "../../../Model/NewsLetter/Audience/AudienceModel";
import IAudienceModel from "../../../Model/NewsLetter/Audience/IAudienceModel";
import IAudiencesService from "./IAudiencesService";

export default class AudiencesService implements IAudiencesService {
    async updateMonthAudience(audience: IAudienceModel): Promise<void> {
        await AudienceModel.findOneAndUpdate({ brand: audience.brand, date: audience.date }, {
            $set: {
                count: { $inc: audience.count }
            }
        }, { upsert: true, new: true });
    }

    async getAudience(brand: string): Promise<IAudienceModel[]> {
        return await AudienceModel.find({ brand });
    }
}