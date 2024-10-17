import { ClientSession, ObjectId } from "mongoose";
import { IGroupModel, ITemplateModel } from "../../../Model/HR/Templates/ITemplateModel";

interface IGroupPosition {
    _id: string,
    position: number
}

interface IGroupTemplates extends IGroupModel {
    templates: ITemplateModel[]
}
interface IGroupController {
    createGroup(group: IGroupModel, session: ClientSession): Promise<IGroupModel>;
    deleteGroup(_id: string): Promise<void>;
    updateGroup(_id: string, group: IGroupModel): Promise<IGroupModel>;
    getAllGroupWithTemplates(): Promise<IGroupTemplates[]>
    getAllGroup(step: string): Promise<IGroupModel[]>;
    addTemplateToGroup(group_id: string, template_ids: Array<string>, session: ClientSession): Promise<string>;
}

export {
    IGroupController,
    IGroupPosition,
    IGroupTemplates
}