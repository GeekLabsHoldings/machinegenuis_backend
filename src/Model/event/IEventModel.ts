import { Types } from "mongoose";
import IEmployeeModel from "../Employee/IEmployeeModel";
import { IBrand } from "../Operations/IBrand_interface";

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
    assignedTo: Types.ObjectId | IEmployeeModel,
    brand:String|Types.ObjectId| IBrand,
    status:string,
    department: string
}