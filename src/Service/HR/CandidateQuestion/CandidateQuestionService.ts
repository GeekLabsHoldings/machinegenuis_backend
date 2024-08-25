import { ClientSession, PipelineStage, Types } from "mongoose";
import candidateQuestionModel from "../../../Model/HR/Candidate/CandidateQuestionsModel";
import ICandidateQuestionsModel from "../../../Model/HR/Candidate/ICandidateQuestionsModel";
import ICandidateQuestionsService from "./ICandidateQuestionService";

class CandidateQuestionService implements ICandidateQuestionsService {


    async createCandidateQuestions(candidateQuestions: ICandidateQuestionsModel): Promise<ICandidateQuestionsModel> {
        const newCandidateQuestion = new candidateQuestionModel(candidateQuestions);
        const result = await newCandidateQuestion.save();
        return result;
    }
    async getCandidateQuestions(candidate_id: string): Promise<ICandidateQuestionsModel | null> {
        const result = await candidateQuestionModel.findOne({ candidate: candidate_id });
        return result;
    }

    async candidateSendTask(candidate_id: string, task_url: string): Promise<ICandidateQuestionsModel | null> {
        const result = await candidateQuestionModel.findOneAndUpdate({ candidate: candidate_id }, { taskLink: task_url }, { new: true });
        return result;
    }
    async ReviewCandidateTask(_id: string, taskApprove: string, session: ClientSession): Promise<ICandidateQuestionsModel | null> {
        const result = await candidateQuestionModel.findOneAndUpdate({ candidate: _id }, { taskApprove }, { new: true }).session(session);
        return result;
    }

    async getAllCandidatesQuestions(_id: string): Promise<ICandidateQuestionsModel[]> {
        const _idObjectID = new Types.ObjectId(_id);
        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: 'candidates',
                    localField: 'candidate',
                    foreignField: '_id',
                    as: 'candidateData'
                }
            },
            {
                $unwind: {
                    path: '$candidateData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    'candidateData.hiring': { $eq: _idObjectID }
                }
            },
            {
                $project: {
                    candidate: {
                        _id: '$candidateData._id',
                        firstName: '$candidateData.firstName',
                        lastName: '$candidateData.lastName',
                        phoneNumber: '$candidateData.phoneNumber',
                        email: '$candidateData.email'
                    },
                    questions: 1,
                    taskLink: 1,
                    taskApprove: 1
                }
            }
        ]
        const result = await candidateQuestionModel.aggregate(pipeline);
        return result;
    }
}

const candidateQuestionsService = new CandidateQuestionService();
export default candidateQuestionsService;