import { ClientSession, ObjectId, UpdateWriteOpResult } from "mongoose";
import { IGroupModel } from "../../../../Model/HR/Templates/ITemplateModel";
import { IGroupService } from "./IGroupService";
import { groupModel } from "../../../../Model/HR/Templates/TemplateModel";
import systemError from "../../../../Utils/Error/SystemError";
import { ErrorMessages } from "../../../../Utils/Error/ErrorsEnum";
import { IGroupPosition } from "../../../../Controller/HR/Template/IGroupController";

class GroupService implements IGroupService {
        async createGroup(group: IGroupModel, session: ClientSession): Promise<IGroupModel> {
        try {
            const newGroup = new groupModel(group);
            const result = await newGroup.save({ session });
            return result;
        } catch (error) {
            return systemError.setStatus(406).setMessage(ErrorMessages.CHECK_GROUP_STEP_AND_POSITION).throw();
        }
    }
    async updatePosition(groups: IGroupPosition[], session: ClientSession): Promise<void> {
        const updatePromises = groups.map(item =>
            groupModel.updateOne({ _id: item._id }, { $set: { position: item.position } }).session(session)
        );
        await Promise.all(updatePromises);
        return;

    }
    async deleteGroup(_id: string): Promise<boolean> {
        const result = await groupModel.findOneAndDelete({ _id })
        return result ? true : false
    }
    async updateGroup(_id: string, group: IGroupModel): Promise<IGroupModel | null> {
        const { description, icon, title } = group;
        const result = await groupModel.findByIdAndUpdate({ _id }, { description, icon, title }, { new: true });
        return result;
    }
    async getAllGroup(step?: string): Promise<IGroupModel[]> {
        return await groupModel.find(step ? { step } : {}).sort({ position: 1 });
    }
}

const groupService = new GroupService();
export default groupService;