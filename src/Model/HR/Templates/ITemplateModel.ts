import { ObjectId } from "mongoose"

interface IGroupModel {
    _id: ObjectId | string
    title: string,
    icon: string,
    position: number,
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
    role: string,
    group_id: ObjectId | string,
}

export {
    IGroupModel,
    ITemplateModel,
    TemplateContainerModel
}