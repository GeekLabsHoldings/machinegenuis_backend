import { Schema, model } from "mongoose";
import IHiringModel from "./IHiringModel";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import { EnumStringRequired, RefType, RequiredNumber, RequiredString } from "../../../Utils/Schemas";
import { Departments } from "../../../Utils/DepartmentAndRoles";
import { JobLevel } from "../../../Utils/Level";
import { HiringStatusLevel } from "../../../Utils/Hiring";
import { HiringSteps } from "../../../Utils/GroupsAndTemplates";

const hiringSchema = new Schema<IHiringModel>({
    title: RequiredString,
    department: EnumStringRequired(Departments),
    role: RefType(SchemaTypesReference.Role, true),
    level: EnumStringRequired(JobLevel),
    createdBy: RefType(SchemaTypesReference.Employee, true),
    createdAt: RequiredNumber,
    currentStep: EnumStringRequired(HiringSteps),
    hiringStatus: EnumStringRequired(HiringStatusLevel),
    linkedinAccount: RefType(SchemaTypesReference.Linkedin_Accounts, false)
});

const hiringModel = model<IHiringModel>(SchemaTypesReference.HIRING, hiringSchema);
export default hiringModel;