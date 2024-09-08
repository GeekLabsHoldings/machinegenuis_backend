import { Schema, model, Types } from "mongoose";
import { messageSchema } from "./message.model";

// Define the schema
const offlineMemberSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },

    message: messageSchema,
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields

// Create the model
const offlineMembersModel = model("offlineMember", offlineMemberSchema);

export default offlineMembersModel;
