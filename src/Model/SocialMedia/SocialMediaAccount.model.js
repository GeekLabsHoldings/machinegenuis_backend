import { Schema, model,Types } from "mongoose";
import { PlatformArr } from "../../Utils/SocialMedia/Platform";
import { EnumStringRequired, RequiredUniqueString } from "../../Utils/Schemas";
import { brandArr } from "../../Utils/SocialMedia/Brand";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { campaignListArr } from "../../Utils/SocialMedia/campaign";

const socialAccountSchema = new Schema({
  sharingList: EnumStringRequired(PlatformArr),
  brand: EnumStringRequired(brandArr),
  userName:{
    type: String,
    required: true,
    unique: {
      value: true,
      message: "Account name already exists",
    }
  },
  accountName: { type: String, required: true },
  accountLink: { type: String, required: true },
  account_id: { type: String, required: true },
  employeeId: {
    type: Types.ObjectId,
    required: true,
    ref: SchemaTypesReference.Employee,
  },
  // Add Niche
  campaignType: EnumStringRequired(campaignListArr),
});

const socialAccountModel = model(
  SchemaTypesReference.SocialMediaAccount,
  socialAccountSchema
);
export default socialAccountModel;