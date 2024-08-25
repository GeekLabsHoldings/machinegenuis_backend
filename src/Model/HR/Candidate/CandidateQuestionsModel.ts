import { Schema, model } from "mongoose";
import ICandidateQuestionsModel, { IQuestions } from "./ICandidateQuestionsModel";
import { EnumStringRequired, NotRequiredNumber, NotRequiredString, RefType, RequiredString } from "../../../Utils/Schemas";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import { statusArr } from "../../../Utils/Hiring";

const QuestionSchema = new Schema<IQuestions>({
    question: RequiredString,
    answer: RequiredString,
});

const schema = new Schema<ICandidateQuestionsModel>({
    candidate: RefType(SchemaTypesReference.Candidate, true),
    questions: [QuestionSchema],
    taskLink: NotRequiredString,
    taskApprove: EnumStringRequired(statusArr)
});

const candidateQuestionModel = model<ICandidateQuestionsModel>(SchemaTypesReference.CANDIDATE_QUESTION, schema);
export default candidateQuestionModel;