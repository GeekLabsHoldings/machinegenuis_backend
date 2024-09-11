import { model, Schema } from 'mongoose';
import IPayrollModel from './IPayrollModel';
import { RefType, RequiredNumber } from '../../../Utils/Schemas';
import { SchemaTypesReference } from '../../../Utils/Schemas/SchemaTypesReference';

const PayrollSchema = new Schema<IPayrollModel>({
    employee: RefType(SchemaTypesReference.Employee, true),
    socialInsurance: RequiredNumber,
    medicalInsurance: RequiredNumber,
    netSalary: RequiredNumber,
    createdAt: RequiredNumber
});

const PayrollModel = model<IPayrollModel>(SchemaTypesReference.Payroll, PayrollSchema);

export default PayrollModel;