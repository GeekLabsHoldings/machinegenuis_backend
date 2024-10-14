import { Schema, Types, model } from "mongoose";
import { EnumStringRequired } from "../../Utils/Schemas";
import { PlatformArr } from "../../Utils/SocialMedia/Platform";
import { brandArr } from "../../Utils/SocialMedia/Brand";
import { campaignListArr } from "../../Utils/SocialMedia/campaign";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
const SocialMediaCommentSchema = new Schema(
  {
    platform: EnumStringRequired(PlatformArr),
    brand: {
      type: Types.ObjectId,
      ref: "brands_collection",
    },
    accountId: {
      type: Types.ObjectId,
      ref: SchemaTypesReference.SocialMediaAccount,
      required:true
    },
    accountName: { type: String, required: true },
    post_id: { type: String, required: true },
    campaignType: EnumStringRequired(campaignListArr),
    comment: String,
    content: String,
  },
  { timestamps: true }
);
const socialCommentModel = model(
  "socialMediaComment",
  SocialMediaCommentSchema
);
export default socialCommentModel;
