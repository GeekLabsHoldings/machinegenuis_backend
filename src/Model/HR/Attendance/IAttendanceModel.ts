import { ObjectId } from "mongoose";
import IEmployeeModel from "../../Employee/IEmployeeModel";

export default interface IAttendanceModel {
    employee: ObjectId | IEmployeeModel,
    checkedIn: number,
    checkedOut: number,
    excuse: boolean,
    warning: boolean
}