import { ClientSession, Types } from "mongoose";
import ICandidateModel, { IStepStatus } from "../../../Model/HR/Candidate/ICandidateModel";
import ICandidateService from "./ICandidateService";
import candidateModel from "../../../Model/HR/Candidate/CandidateModel";

class CandidateService implements ICandidateService {
    async createCandidate(candidate: ICandidateModel[]): Promise<void> {
        await candidateModel.create(candidate);
    }
    async getAllCandidateByHiring(hiring: string, hiringStep: string, limit: number | null, skip: number | null): Promise<ICandidateModel[]> {
        const query = candidateModel.find({ hiring, currentStep: hiringStep })
            .sort({ createdAt: -1 })
        if (limit) query.limit(limit);
        if (skip) query.skip(skip);
        const result = await query.exec();
        return result;
    }
    async getCandidate(_id: string, session?: ClientSession): Promise<ICandidateModel | null> {
        const result = await candidateModel.findById(_id, null, { session });
        return result;
    }

    async getCandidateByEmail(email: string): Promise<ICandidateModel & { _id: Types.ObjectId; } | null> {
        const result = await candidateModel.findOne({ email });
        return result;
    }

    async changeCurrentStep(_id: string, step: string, stepsStatus: Array<IStepStatus>, session: ClientSession): Promise<ICandidateModel | null> {
        const result = await candidateModel.findByIdAndUpdate(_id, { $set: { currentStep: step, stepsStatus } }, { new: true }).session(session);
        return result;
    }

    async changeMessageStatus(_id: string, messageStatus: Array<IStepStatus>, session: ClientSession): Promise<ICandidateModel | null> {
        const result = await candidateModel.findByIdAndUpdate(_id, { $set: { messageStatus } }, { new: true }).session(session);
        return result;
    }
    async getAll(role: string | null, limit: number, skip: number): Promise<ICandidateModel[]> {
        const result = await candidateModel.find(role ? { role } : {}).select({ firstName: 1, lastName: 1, role: 1, phoneNumber: 1, email: 1, linkedIn: 1, cvLink: 1 })
            .skip(skip).limit(limit);
        return result;
    }

}

const candidateService = new CandidateService();

export default candidateService;