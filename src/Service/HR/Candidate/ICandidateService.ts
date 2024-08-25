import { ClientSession, Types } from "mongoose";
import ICandidateModel, { IStepStatus } from "../../../Model/HR/Candidate/ICandidateModel";

export default interface ICandidateService {
    getAllCandidateByHiring(hiring: string, hiringStep: string, limit: number, skip: number): Promise<ICandidateModel[]>
    getCandidate(_id: string, session: ClientSession): Promise<ICandidateModel | null>;
    getCandidateByEmail(email: string): Promise<ICandidateModel &  {_id: Types.ObjectId;} | null>;
    changeCurrentStep(_id: string, step: string, stepsStatus: Array<IStepStatus>, session: ClientSession): Promise<ICandidateModel | null>
    changeMessageStatus(_id: string, messageStatus: Array<IStepStatus>, session: ClientSession): Promise<ICandidateModel | null>
    getAll(role:string | null,limit:number,skip:number):Promise<ICandidateModel[]>;
} 