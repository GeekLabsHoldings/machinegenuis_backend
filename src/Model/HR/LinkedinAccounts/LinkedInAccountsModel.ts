import { model, Schema } from "mongoose";
import ILinkedinAccountsModel from "./ILinkedinAccountsModel";
import { RequiredBoolean, RequiredString } from "../../../Utils/Schemas";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";

const schema = new Schema<ILinkedinAccountsModel>({
    accountInfo: RequiredString,
    isBusy: RequiredBoolean
});

const linkedinAccountModel = model<ILinkedinAccountsModel>(SchemaTypesReference.Linkedin_Accounts, schema);
export default linkedinAccountModel;