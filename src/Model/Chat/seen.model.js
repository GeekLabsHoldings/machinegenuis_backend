import { Schema, model, Types } from "mongoose";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
const seenSchema = new Schema({
  userId: { type: Types.ObjectId, ref: SchemaTypesReference.Employee },
  chat: { type: Types.ObjectId, ref: SchemaTypesReference.Conversation },
  seen: { type: Number },
});
const seenModel = model(SchemaTypesReference.Seen, seenSchema);
export default seenModel;
