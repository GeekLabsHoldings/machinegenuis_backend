import { ObjectId } from "mongoose";
import { IGroupModel } from "../Templates/ITemplateModel";
import IEmployeeModel from "../../Employee/IEmployeeModel";

interface IHiringModel {
    title: string,
    department: string,
    role: string,
    level: string,
    createdBy: ObjectId | IEmployeeModel,
    createdAt: number,
    currentStep: string,
    hiringStatus: string,
    linkedinAccount: ObjectId | null
}

export default IHiringModel;