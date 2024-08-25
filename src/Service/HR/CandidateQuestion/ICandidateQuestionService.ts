import { ClientSession } from "mongoose";
import ICandidateQuestionsModel from "../../../Model/HR/Candidate/ICandidateQuestionsModel";

export default interface ICandidateQuestionsService {
    createCandidateQuestions(candidateQuestions: ICandidateQuestionsModel): Promise<ICandidateQuestionsModel>;
    getCandidateQuestions(candidate_id: string): Promise<ICandidateQuestionsModel | null>;
    candidateSendTask(candidate_id: string, task_url: string): Promise<ICandidateQuestionsModel | null>;
    ReviewCandidateTask(_id: string, taskApprove: string, session: ClientSession): Promise<ICandidateQuestionsModel | null>;
    getAllCandidatesQuestions(_id: string): Promise<ICandidateQuestionsModel[]>;
}