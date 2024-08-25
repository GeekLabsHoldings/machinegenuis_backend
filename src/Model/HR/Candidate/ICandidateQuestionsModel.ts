import { Types } from "mongoose";
import ICandidateModel from "./ICandidateModel";
export interface IQuestions {
    question: string,
    answer: string
}
export default interface ICandidateQuestionsModel {
    candidate: Types.ObjectId | ICandidateModel,
    questions: IQuestions[],
    taskLink?: string,
    taskApprove: string
}