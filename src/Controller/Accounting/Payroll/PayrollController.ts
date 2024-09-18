import IPayrollController, { IPayrollResponse } from "./IPayrollController";
import PayrollService from "../../../Service/Accounting/Payroll/PayrollService";

class PayrollController implements IPayrollController {
    async getAccountingPayroll(page: number, limit: number): Promise<IPayrollResponse[]> {
        const payrollService = new PayrollService();
        const Payroll = await payrollService.getPayroll(page, limit);
        const result: IPayrollResponse[] = Payroll.map((payroll) => {
            return {
                _id: payroll._id,
                employee: payroll.employee,
                medicalInsurance: payroll.medicalInsurance,
                socialInsurance: payroll.socialInsurance,
                netSalary: payroll.netSalary,
                grossSalary: payroll.medicalInsurance + payroll.socialInsurance + payroll.netSalary,
                createdAt: payroll.createdAt,
            };
        });
        return result;
    }
}


export default PayrollController;