import { ClientSession } from "mongoose";
import IPayrollModel from "../../../Model/Accounting/Payroll/IPayrollModel";

export default interface IPayrollService {
    createPayroll(payrollData: IPayrollModel, session: ClientSession): Promise<void>;
    getPayroll(page: number, limit: number): Promise<IPayrollModel[]>;
}