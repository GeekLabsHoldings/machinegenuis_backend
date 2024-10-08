import { model, Schema } from "mongoose";
import IZohoEmailModel from "./IZohoEmails";
import { EnumStringRequired, NotRequiredString, RefType, RequiredString } from "../../../Utils/Schemas";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import { Departments } from "../../../Utils/DepartmentAndRoles";

const ZohoEmailsSchema = new Schema<IZohoEmailModel>({
    accountId: RequiredString,
    accountName: RequiredString,
    accountEmail: RequiredString,
    zohoId: RequiredString,
    brand: RefType(SchemaTypesReference.Brands, false),
    department: [EnumStringRequired(Departments)],
    refreshToken: NotRequiredString,
    clientId: NotRequiredString,
    clientSecret: NotRequiredString,
    scope: NotRequiredString,
    code: NotRequiredString,
    domain: RequiredString
})

const ZohoEmailsModel = model(SchemaTypesReference.BrandEmail, ZohoEmailsSchema);

export default ZohoEmailsModel;