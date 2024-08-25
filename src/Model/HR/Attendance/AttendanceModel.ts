import { model, Schema } from "mongoose";
import { NotRequiredNumber, NotRequiredString, RefType, RequiredBoolean, RequiredNumber, RequiredString, StringValidation } from "../../../Utils/Schemas";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import IAttendanceModel from "./IAttendanceModel";

const schema = new Schema<IAttendanceModel>({
    employee: RefType(SchemaTypesReference.Employee, true),
    checkedIn: RequiredNumber,
    checkedOut: NotRequiredNumber,
    excuse: RequiredBoolean,
    warning: RequiredBoolean

});

const attendanceModel = model(SchemaTypesReference.Attendance, schema);
export default attendanceModel;

