import { ClientSession } from "mongoose";
import { IGroupModel } from "../../../../Model/HR/Templates/ITemplateModel";
import { IGroupPosition } from "../../../../Controller/HR/Template/IGroupController";

export interface IGroupService {
    createGroup(group: IGroupModel, session: ClientSession): Promise<IGroupModel>;
    updatePosition(groups: IGroupPosition[], session: ClientSession): Promise<void>;
    deleteGroup(_id: string): Promise<boolean>;
    updateGroup(_id: string, group: IGroupModel): Promise<IGroupModel | null>;
    getAllGroup(step: string): Promise<IGroupModel[]>;
}