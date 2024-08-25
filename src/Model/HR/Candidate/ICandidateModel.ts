import { Types } from "mongoose";
import IHiringModel from "../Hiring/IHiringModel";
import IEmployeeModel from "../../Employee/IEmployeeModel";

export interface IStepStatus {

    step: string,
    status: string

}
export default interface ICandidateModel {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    linkedIn: string,
    role: string,
    cvLink: string,
    portfolio: string,
    department: string,
    appliedFrom: string,
    hiring: Types.ObjectId | IHiringModel,
    createdAt: number,
    recommendation: Types.ObjectId | IEmployeeModel,
    currentStep: string,
    stepsStatus: Array<IStepStatus>,
    messageStatus: Array<IStepStatus>
}