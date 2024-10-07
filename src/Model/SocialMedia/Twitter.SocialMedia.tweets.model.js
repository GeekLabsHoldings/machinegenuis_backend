import { Schema, Types, model } from "mongoose";
import { EnumStringRequired } from "../../Utils/Schemas";
import { PlatformArr } from "../../Utils/SocialMedia/Platform";
import { brandArr } from "../../Utils/SocialMedia/Brand";
import { campaignListArr } from "../../Utils/SocialMedia/campaign";
const SocialMediaCommentSchema = new Schema({
  platform: EnumStringRequired(PlatformArr),
  brand: {
    type: Types.ObjectId,
    ref: "brands_collection",
  },
  accountName: { type: String, required: true },
  comment: String,
  content: String,
  post_id: { type: String, required: true },
  campaignType: EnumStringRequired(campaignListArr),
});
const socialCommentModel = model(
  "socialMediaComment",
  SocialMediaCommentSchema
);
export default socialCommentModel;