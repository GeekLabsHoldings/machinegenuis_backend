import { hash } from "bcrypt";
import { Schema, model, Types } from "mongoose";
import { platform } from "os";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
const socialMediaSchema = new Schema({
  platform: {
    type: String,
    required: true,
    enum: ["facebook", "twitter", "linkedin", "reddit"],
  },
  brand: {
    type: String,
    required: true,
    enum: [
      "PST",
      "Street Politics",
      "Movie Myth",
      "Investorcracy",
      "Media Projects",
      "PST Canada",
    ],
  },
  content: {
    type: String,
    required: true,
  },
  employeeId: {
    type: Types.ObjectId,
    required: true,
    ref: SchemaTypesReference.Employee,
  },
  
});
export const socialMediaModel= model(SchemaTypesReference.SocialMedia, socialMediaSchema);
