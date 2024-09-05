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
conversationSchema.pre('save', function (next) {
  if (Array.isArray(this.members)) {
    // Ensure the members array is unique
    const uniqueMembers = [...new Set(this.members.map(member => member.toString()))];
    this.members = uniqueMembers.map(member => new Types.ObjectId(member)); // Convert back to ObjectId
  } else {
    return next(new Error('Members field is not an array.'));
  }

  next();
});
const conversationModel = model(
  SchemaTypesReference.Conversation,
  conversationSchema
);
export default conversationModel;
