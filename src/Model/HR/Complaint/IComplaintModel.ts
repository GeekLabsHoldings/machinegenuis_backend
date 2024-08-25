import { ObjectId, Types } from "mongoose";
import IEmployeeModel from "../../Employee/IEmployeeModel";

export default interface IComplaintModel {
    complaintIssue: string,
    description: string,
    employee: Types.ObjectId | IEmployeeModel,
    urgencyLevel: string,
    createdAt: number,
    solved: boolean
}