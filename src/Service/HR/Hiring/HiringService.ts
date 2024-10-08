import hiringModel from "../../../Model/HR/Hiring/HiringModel";
import IHiringModel from "../../../Model/HR/Hiring/IHiringModel";
import IHiringService from "./IHiringService";
import { HiringStatus, HiringStatusLevelEnum } from "../../../Utils/Hiring";
import { ClientSession } from "mongoose";
import { HiringStepsEnum } from "../../../Utils/GroupsAndTemplates";

class HiringService implements IHiringService {
    async addHiringLinkedinAccount(_id: string, account_id: string, session: ClientSession): Promise<IHiringModel | null> {
        return await hiringModel.findByIdAndUpdate(_id, { $set: { linkedinAccount: account_id, currentStep: HiringStepsEnum.Get_Job_Candidates } }, { session });
    }

    async createHiring(hiring: IHiringModel): Promise<IHiringModel> {
        const newHiring = new hiringModel(hiring);
        const result = await newHiring.save();
        return result;
    }
    async changeHiringStep(_id: string, currentStep: string, hiringStatus: string): Promise<IHiringModel | null> {
        const result = await hiringModel.findOneAndUpdate({ _id }, { $set: { currentStep, hiringStatus } }, { new: true });
        return result;
    }
    async getHiring(type: string, limit: number, skip: number): Promise<IHiringModel[]> {
        const query = hiringModel.find()
            .populate({
                path: 'createdBy', select: { _id: 1, firstName: 1, lastName: 1, theme: 1 }
            })
            .sort({ createdAt: -1 }).limit(limit).skip(skip);
        if (type === HiringStatus.OPENING)
            query.where({ hiringStatus: HiringStatusLevelEnum.CONTINUE })
        else if (type === HiringStatus.REQUEST)
            query.where({ hiringStatus: HiringStatusLevelEnum.START_HIRING });
        else if (type === HiringStatus.COMPLETE)
            query.where({ hiringStatus: HiringStatusLevelEnum.COMPLETE });
        return await query.exec();
    }

    async getOneHiring(_id: string): Promise<IHiringModel | null> {
        return await hiringModel.findById(_id);
    }

    async deleteHiringRequest(_id: string): Promise<boolean> {
        const result = await hiringModel.findOneAndDelete({ _id });
        return result ? true : false;
    }

}

const hiringService = new HiringService();
export default hiringService;