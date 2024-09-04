import { Schema, model, Types } from "mongoose";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { NotRequiredString } from "../../Utils/Schemas";

const conversationSchema = new Schema({
  members: [
    {
      type: Types.ObjectId,
      ref: SchemaTypesReference.Employee,
      required: true,
    },
  ],
  type: { type: String, enum: ["oneToOne", "group"], required: true },
  admin: { type: String },
  groupName: { type: String },
  createdAt: {
    type: Number,
  },
  updatedAt: {
    type: Number,
  },
  lastMessage: NotRequiredString,
});

const conversationModel = model(
  SchemaTypesReference.Conversation,
  conversationSchema
);
export default conversationModel;
