import { ClientSession } from "mongoose";
import IHiringModel from "../../../Model/HR/Hiring/IHiringModel";
import { ITemplateModel } from "../../../Model/HR/Templates/ITemplateModel";
import ICandidateModel from "../../../Model/HR/Candidate/ICandidateModel";
export interface ICurrentStepTemplate extends ITemplateModel {
    jobTitle: string
}

export interface IStepsOfHiring {
    candidates: ICandidateModel[],
    template: ITemplateModel | "",
    step: string
    level: string
    role: string
    _id: string
}
export interface IQuestionTemplate {
    type: number,
    question: string
    answer: number
}
export default interface IHiringController {
    createHiring(hiring: IHiringModel): Promise<IHiringModel>;
    getHiring(type: string, limit: number, skip: number): Promise<IHiringModel[]>;
    deleteHiringRequest(_id: string): Promise<string>;
    toNextStep(_id: string): Promise<IHiringModel>;
    getCurrentStepTemplate(_id: string, requestCurrentStep: string | null): Promise<IStepsOfHiring>;
    publishJob(hiringId: string, role: string, contract: string, template: string, skills: Array<string>, questions: Array<IQuestionTemplate>, session: ClientSession): Promise<string>;
}