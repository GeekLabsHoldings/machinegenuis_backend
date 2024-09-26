import { Schema, model,Types } from "mongoose";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { EnumStringRequired } from "../../Utils/Schemas";
import { PlatformArr } from "../../Utils/SocialMedia/Platform";
import { brandArr } from "../../Utils/SocialMedia/Brand";

const RedditAccountSchema = new Schema({
  platform: EnumStringRequired(PlatformArr),

  brand: EnumStringRequired(brandArr),
  
  token: { type: String, required: true },

});

const RedditAccountModel = model( SchemaTypesReference.RedditAccount,RedditAccountSchema);

export default RedditAccountModel;