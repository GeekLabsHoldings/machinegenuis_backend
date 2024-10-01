import { hash } from "bcrypt";
import { Schema, model, Types } from "mongoose";
import { platform, type } from "os";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { EnumStringRequired } from "../../Utils/Schemas";
import { PlatformArr } from "../../Utils/SocialMedia/Platform";
import { brandArr } from "../../Utils/SocialMedia/Brand";
const socialMediaSchema = new Schema({
  platform: EnumStringRequired(PlatformArr),
  brand: EnumStringRequired(brandArr),
  content: {
    type: String,
  },
  postId: { type: String, required: true },
  employeeId: {
    type: Types.ObjectId,
    required: true,
    ref: SchemaTypesReference.Employee,
  },
});
export const socialMediaModel = model(
  SchemaTypesReference.SocialMedia,
  socialMediaSchema
);
