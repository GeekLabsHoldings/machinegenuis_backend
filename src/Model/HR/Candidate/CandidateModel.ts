import { model, Schema } from "mongoose";
import { EnumStringRequired, NotRequiredString, RefType, RequiredBoolean, RequiredNumber, RequiredString, StringValidation } from "../../../Utils/Schemas";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import ICandidateModel, { IStepStatus } from "./ICandidateModel";
import { phoneRegex } from "../../../Utils/Regex";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import { HiringSteps } from "../../../Utils/GroupsAndTemplates";
import { statusArr } from "../../../Utils/Hiring";


const stepStatusSchema = new Schema<IStepStatus>({
    step: EnumStringRequired(HiringSteps),
    status: EnumStringRequired(statusArr)
})
const schema = new Schema<ICandidateModel>({
    firstName: RequiredString,
    lastName: RequiredString,
    email: RequiredString,
    phoneNumber: StringValidation(phoneRegex, ErrorMessages.NULL),
    linkedIn: RequiredString,
    role: RequiredString,
    department: RequiredString,
    cvLink: RequiredString,
    portfolio: NotRequiredString,
    appliedFrom: RequiredString,
    hiring: RefType(SchemaTypesReference.HIRING, true),
    recommendation: RefType(SchemaTypesReference.Employee, false),
    createdAt: RequiredNumber,
    currentStep: EnumStringRequired(HiringSteps, 2),
    stepsStatus: [stepStatusSchema],
    messageStatus: [stepStatusSchema]

});

schema.pre("save", function (next) {
    const candidate = this as ICandidateModel;
    candidate.stepsStatus = [];
    candidate.messageStatus = [];
    for (let i = 0; i < HiringSteps.length; i++) {
        candidate.stepsStatus.push({ step: HiringSteps[i], status: statusArr[0] });
        candidate.messageStatus.push({ step: HiringSteps[i], status: statusArr[0] });
    }
    next();
});
const candidateModel = model(SchemaTypesReference.Candidate, schema);
export default candidateModel;

