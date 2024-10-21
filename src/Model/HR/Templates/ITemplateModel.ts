import { ObjectId, Types } from "mongoose"
import IRoleModel from "../Role/IRoleModel"

interface IGroupModel {
    _id: ObjectId | string
    title: string,
    icon: string,
    step: string,
    description: string,
}

interface TemplateContainerModel {
    title: string,
    description: any
}
interface ITemplateModel {
    title: string,
    details: Array<TemplateContainerModel>,
    level: string,
    role: Types.ObjectId | string | IRoleModel & { _id: string | Types.ObjectId } | null,
    group_id: ObjectId | string,
    step: string,
}

export {
    IGroupModel,
    ITemplateModel,
    TemplateContainerModel
}