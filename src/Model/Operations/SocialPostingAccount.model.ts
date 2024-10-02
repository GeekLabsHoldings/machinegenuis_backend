import { Schema, model,Types } from "mongoose";
import { SchemaTypesReference } from "../../Utils/Schemas/SchemaTypesReference";
import { EnumStringRequired } from "../../Utils/Schemas";
import { PlatformArr } from "../../Utils/SocialMedia/Platform";
import { IAccount } from "./IPostingAccounts_interface";


const SocialPostingAccountSchema = new Schema<IAccount>({
  platform: EnumStringRequired(PlatformArr),

  brand: Types.ObjectId,
  
  token: { type: String, required: true },

});

const SocialPostingAccount = model( SchemaTypesReference.SocialPostingAccount,SocialPostingAccountSchema);

export default SocialPostingAccount;