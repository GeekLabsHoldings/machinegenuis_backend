import { ObjectId, Types } from "mongoose";
import IEmployeeModel from "../../Employee/IEmployeeModel";
import IRoleModel from "../Role/IRoleModel";

interface IHiringModel {
    title: string,
    department: string,
    role: Types.ObjectId | IRoleModel & { _id: Types.ObjectId | string } | string,
    level: string,
    createdBy: ObjectId | IEmployeeModel,
    createdAt: number,
    currentStep: string,
    hiringStatus: string,
    linkedinAccount: ObjectId | null
}

export default IHiringModel;