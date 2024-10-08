import { ClientSession, isObjectIdOrHexString, ObjectId, Types } from "mongoose";
import { IGroupController, IGroupPosition, IGroupTemplates } from "./IGroupController";
import { IGroupModel, ITemplateModel } from "../../../Model/HR/Templates/ITemplateModel";
import groupService from "../../../Service/HR/Template/Group/GroupService";
import systemError from "../../../Utils/Error/SystemError";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import SuccessMessage from "../../../Utils/SuccessMessages";
import templateService from "../../../Service/HR/Template/Template/TemplateService";

class GroupController implements IGroupController {

    async createGroup(group: IGroupModel,  session: ClientSession): Promise<IGroupModel> {
        const position = await groupService.getCurrentGroupPosition();
        group.position = position + 1;
        const newGroup = await groupService.createGroup(group, session);
        return newGroup;
    }

    async updatePosition(group: IGroupPosition[], session: ClientSession): Promise<IGroupPosition[]> {
        const idSet = new Set<string>();
        const count = await groupService.getCurrentGroupPosition();
        if (group.length !== count)
            return systemError.setStatus(406).setMessage(ErrorMessages.MUST_SEND_ALL_GROUPS).throw();
        group.sort((a: IGroupPosition, b: IGroupPosition) => a.position - b.position);
        for (let i = 0; i < group.length; i++) {
            if (idSet.has(group[i]._id))
                return systemError.setStatus(406).setMessage(ErrorMessages.DUPLICATED_ID_IN_REARRANGE).throw();
            idSet.add(group[i]._id);
            if (group[i].position !== i + 1) {
                return systemError.setStatus(406).setMessage(ErrorMessages.GROUPS_POSITION_IS_INVALID).throw();
            }
        }
        await groupService.updatePosition(group, session);
        return group;

    }

    async deleteGroup(_id: string): Promise<void> {
        const result = await groupService.deleteGroup(_id);
        if (!result)
            return systemError.setStatus(402).setMessage(ErrorMessages.CAN_NOT_DELETE_GROUPS).throw()
    }

    async updateGroup(_id: string, group: IGroupModel): Promise<IGroupModel> {
        const result = await groupService.updateGroup(_id, group);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.GROUP_NOT_FOUND).throw();
        return result;
    }

    async getAllGroupWithTemplates(): Promise<IGroupTemplates[]> {
        const groups = await groupService.getAllGroup();
        const templates = await templateService.getAttachedTemplate();
        const groupTemplates = templates.reduce((acc: Record<string, ITemplateModel[]>, template: ITemplateModel) => {
            if (isObjectIdOrHexString(template.group_id)) {
                const groupId = (template.group_id).toString();
                if (!acc[groupId]) {
                    acc[groupId] = [];
                }
                acc[groupId].push(template);
            }
            return acc;
        }, {});

        const result = groups.map((group: IGroupModel) => {
            return ({
                _id: group._id,
                title: group.title,
                description: group.description,
                icon: group.icon,
                step: group.step,
                position: group.position,
                templates: groupTemplates[(group._id) as string] || []
            })
        });
        return result;
    }

    async getAllGroup(step:string): Promise<IGroupModel[]> {
        return await groupService.getAllGroup(step);
    }

    async addTemplateToGroup(group_id: string, template_ids: Array<string>, session: ClientSession): Promise<string> {
        await templateService.addGroupToTemplate(group_id, template_ids, session);
        return SuccessMessage.DONE;
    }

}

const groupController = new GroupController();
export default groupController;