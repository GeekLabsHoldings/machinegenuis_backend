import { ClientSession } from "mongoose";
import IHiringModel from "../../../Model/HR/Hiring/IHiringModel";
import { ITemplateModel } from "../../../Model/HR/Templates/ITemplateModel";
export interface ICurrentStepTemplate extends ITemplateModel {
    jobTitle: string
}
export default interface IHiringController {
    createHiring(hiring: IHiringModel): Promise<IHiringModel>;
    getHiring(type: string, limit: number, skip: number): Promise<IHiringModel[]>;
    deleteHiringRequest(_id: string): Promise<string>;
    toNextStep(_id: string): Promise<IHiringModel>;
    getCurrentStepTemplate(_id: string): Promise<ITemplateModel[]>;
    publishJob(hiringId: string, contract: string, template: string, skills: Array<string>, role: string, session: ClientSession): Promise<{ userName: string }>;
}