import { model, Schema } from "mongoose";
import { EnumStringRequired, RefType, RequiredBoolean, RequiredNumber, RequiredString } from "../../../Utils/Schemas";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import IComplaintModel from "./IComplaintModel";
import { UrgencyLevel } from "../../../Utils/Level";

const schema = new Schema<IComplaintModel>({
    complaintIssue: RequiredString,
    createdAt: RequiredNumber,
    description: RequiredString,
    employee: RefType(SchemaTypesReference.Employee, true),
    urgencyLevel:EnumStringRequired(UrgencyLevel),
    solved:RequiredBoolean
});

const complaintModel = model(SchemaTypesReference.Complaint, schema);
export default complaintModel;

