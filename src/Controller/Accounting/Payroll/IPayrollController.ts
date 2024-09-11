import IPayrollModel from "../../../Model/Accounting/Payroll/IPayrollModel";

export default interface IPayrollController {
    getAccountingPayroll(page: number, limit: number): Promise<IPayrollModel[]>;
}