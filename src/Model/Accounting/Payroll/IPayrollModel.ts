import { Types } from "mongoose";
import IEmployeeModel from "../../Employee/IEmployeeModel";

export default interface IPayrollModel {
    employee?: Types.ObjectId | string | IEmployeeModel;
    socialInsurance: number;
    medicalInsurance: number;
    netSalary: number,
    createdAt: number
}