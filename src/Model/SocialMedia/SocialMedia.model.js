import { hash } from "bcrypt";
import { Schema, model, Types } from "mongoose";
import { platform, type } from "os";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { EnumStringRequired } from "../../Utils/Schemas";
import { PlatformArr } from "../../Utils/SocialMedia/Platform";
export const socialMediaSchema = new Schema({
  platform: EnumStringRequired(PlatformArr),
  brandId: {
    type: Types.ObjectId,
    ref: SchemaTypesReference.Brands,
  },
  content: {
    type: String,
  },
  postId: { type: String, required: false },
  employeeId: {
    type: Types.ObjectId,
    required: false,
    ref: SchemaTypesReference.Employee,
  },
});