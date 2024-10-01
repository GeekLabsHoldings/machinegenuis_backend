import { Schema, model,Types } from "mongoose";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { EnumStringRequired } from "../../Utils/Schemas";
import { PlatformArr } from "../../Utils/SocialMedia/Platform";
import { brandArr } from "../../Utils/SocialMedia/Brand";

const TwitterDataSchema = new Schema({

  brand: EnumStringRequired(brandArr),
  
  token: { type: String, required: true },

});

const twitterModel = model( SchemaTypesReference.TwitterData,TwitterDataSchema);

export default twitterModel;