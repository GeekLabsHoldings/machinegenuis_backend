import IPayrollController from "./IPayrollController";
import IPayrollModel from "../../../Model/Accounting/Payroll/IPayrollModel";
import PayrollService from "../../../Service/Accounting/Payroll/PayrollService";

class PayrollController implements IPayrollController {
    async getAccountingPayroll(page: number, limit: number): Promise<IPayrollModel[]> {
        const payrollService = new PayrollService();
        return await payrollService.getPayroll(page, limit);
    }
}


export default PayrollController;