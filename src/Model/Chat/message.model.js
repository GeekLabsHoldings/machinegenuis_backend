import { Schema, model, Types } from "mongoose";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";

export const messageSchema = new Schema({
  sender: {
    type: Types.ObjectId,
    ref: SchemaTypesReference.Employee,
    required: true,
  },
  text: { type: String, required: true },
  mediaUrl: { type: String },

  chat: { type: Types.ObjectId, ref: SchemaTypesReference.Conversation },
  createdAt: {
    type: Number,
  },
});
const messageModel = model(SchemaTypesReference.Message, messageSchema);
export default messageModel;
