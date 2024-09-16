import { ClientSession } from "mongoose";
import IPayrollModel from "../../../Model/Accounting/Payroll/IPayrollModel";
import IPayrollService from "./IPayrollService";
import PayrollModel from "../../../Model/Accounting/Payroll/PayrollModel";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";

class PayrollService implements IPayrollService {
    async createPayroll(payrollData: IPayrollModel, session: ClientSession): Promise<void> {
        const payroll = new PayrollModel(payrollData);
        await payroll.save({ session });
    }

    async getPayroll(page: number, limit: number): Promise<IPayrollModel[]> {
        return await PayrollModel.find().populate({
            path: `${SchemaTypesReference.Employee}`,
            select: { _id: 1, firstName: 1, lastName: 1 }
        }).skip(page * limit).limit(limit);
    }
}


export default PayrollService;