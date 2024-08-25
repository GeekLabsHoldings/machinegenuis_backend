import { Types } from "mongoose";
import IEmployeeModel from "../Employee/IEmployeeModel";

export default interface IEventModel {
    title: string,
    start: string,
    end: string,
    startNumber: number,
    endNumber: number,
    backgroundColor: string,
    articleImg: string,
    description: string,
    articleTitle: string,
    createdBy: Types.ObjectId | IEmployeeModel,
    assignedTo: Types.ObjectId | IEmployeeModel
}