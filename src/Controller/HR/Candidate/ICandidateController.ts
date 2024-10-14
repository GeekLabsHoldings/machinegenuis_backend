import { ClientSession } from "mongoose";
import ICandidateModel from "../../../Model/HR/Candidate/ICandidateModel";
import ICandidateQuestionsModel from "../../../Model/HR/Candidate/ICandidateQuestionsModel";

export default interface ICandidateController {
    getCandidateFromLinkedin(): Promise<void>;
    getAllCandidateByHiring(hiring: string, hiringStep: string, limit: number, skip: number): Promise<ICandidateModel[]>
    changeMessageStatus(_id: string, candidate: ICandidateModel, session: ClientSession): Promise<void>;
    changeCurrentStepStatus(_id: string, status: boolean, session: ClientSession): Promise<ICandidateModel>;
    addCandidateQuestion(question: ICandidateQuestionsModel): Promise<ICandidateQuestionsModel>;
    getCandidateQuestion(_id: string): Promise<ICandidateQuestionsModel>;
    candidateAddTask(email: string, task_url: string): Promise<ICandidateQuestionsModel>;
    getAllCandidateQuestionsAndTask(_id: string): Promise<ICandidateQuestionsModel[]>;
    changeCandidateTaskStatus(_id: string, status: string, session: ClientSession): Promise<ICandidateModel>;
    getAllCandidate(role: string | null, limit: number, skip: number): Promise<ICandidateModel[]>;
}