import { Schema, model } from "mongoose";
import { EnumStringRequired } from "../../Utils/Schemas";
import { PlatformArr } from "../../Utils/SocialMedia/Platform";
import { brandArr } from "../../Utils/SocialMedia/Brand";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
const SocialMediaCommentSchema = new Schema({
  platform: EnumStringRequired(PlatformArr),
  brand: EnumStringRequired(brandArr),
  accountName: { type: String, required: true },
  comment: { type: String, required: true },
  post_id: { type: String, required: true },
});

const socialCommentModel = model(SchemaTypesReference.SocialMediaComment, SocialMediaCommentSchema);

export default socialCommentModel;
