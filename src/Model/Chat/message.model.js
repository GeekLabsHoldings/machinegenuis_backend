import { Schema, model, Types } from "mongoose";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import {
  NotRequiredString,
  RefType,
  RequiredNumber,
  RequiredString,
} from "../../Utils/Schemas";
const mediaSchema = new Schema({
  url: RequiredString,
  type: RequiredString,
});
export const messageSchema = new Schema({
  sender: RefType(SchemaTypesReference.Employee, true),
  text: NotRequiredString,
  media: [mediaSchema],
  chat: RefType(SchemaTypesReference.Conversation, true),
  createdAt: RequiredNumber,
});
const messageModel = model(SchemaTypesReference.Message, messageSchema);
export default messageModel;
