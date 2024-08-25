import { model, Schema } from "mongoose";
import { NotRequiredString, RefType, RequiredNumber, RequiredString } from "../../../Utils/Schemas";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import IEmployeePaperModel from "./IEmployeePaperModel";

const schema = new Schema<IEmployeePaperModel>({
    contractUrl: RequiredString,
    graduationCertificateUrl: NotRequiredString,
    militaryUrl: NotRequiredString,
    IdScanUrl: NotRequiredString,
    criminalRecordUrl: NotRequiredString,
    insuranceUrl: NotRequiredString,
    employee: RefType(SchemaTypesReference.Employee, true),
    startDate: RequiredNumber,
    endDate: RequiredNumber
});

const employeePaperModel = model(SchemaTypesReference.EmployeePaper, schema);
export default employeePaperModel;

