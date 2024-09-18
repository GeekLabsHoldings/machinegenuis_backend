import { Types } from "mongoose";
import IPayrollModel from "../../../Model/Accounting/Payroll/IPayrollModel";
export interface IPayrollResponse extends IPayrollModel {
    _id: Types.ObjectId | string;
    grossSalary: number;
}

export default interface IPayrollController {
    getAccountingPayroll(page: number, limit: number): Promise<IPayrollResponse[]>;
}