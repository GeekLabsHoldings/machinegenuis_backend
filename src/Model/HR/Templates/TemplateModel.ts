import { model, Schema } from "mongoose";
import { EnumStringNotRequired, EnumStringRequired, NotRequiredString, RefType, RequiredNumber, RequiredString } from "../../../Utils/Schemas";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import { IGroupModel, ITemplateModel } from "./ITemplateModel";
import { Roles } from "../../../Utils/DepartmentAndRoles";
import { JobLevel } from "../../../Utils/Level";
import { HiringSteps } from "../../../Utils/GroupsAndTemplates";


const templateContainerSchema = new Schema({
    title: { type: String, required: true },
    description: { type: Schema.Types.Mixed, required: true }
});


const groupSchema = new Schema<IGroupModel>({
    title: RequiredString,
    description: NotRequiredString,
    icon: NotRequiredString,
    step: EnumStringRequired(HiringSteps),
});

const templateSchema = new Schema<ITemplateModel>({
    title: RequiredString,
    level: EnumStringNotRequired(JobLevel),
    details: [templateContainerSchema],
    role: EnumStringNotRequired(Roles),
    group_id: RefType(SchemaTypesReference.Group, false),
    step: EnumStringRequired(HiringSteps),

})



groupSchema.pre('findOneAndDelete', async function (next) {
    const group = await this.model.findOne(this.getFilter());
    if (group) {
        await templateModel.updateMany(
            { group_id: group._id },
            { $set: { group_id: null } }
        );
    }
    next();
});


const groupModel = model(SchemaTypesReference.Group, groupSchema);
const templateModel = model(SchemaTypesReference.TEMPLATE, templateSchema);


export {
    groupModel,
    templateModel,
}

