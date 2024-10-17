import { ClientSession, PipelineStage, Types } from "mongoose";
import { ITemplateModel } from "../../../../Model/HR/Templates/ITemplateModel";
import { templateModel } from "../../../../Model/HR/Templates/TemplateModel";
import { ITemplateService } from "./ITemplateService";

class TemplateService implements ITemplateService {
    async createTemplates(template: ITemplateModel): Promise<ITemplateModel & { _id: Types.ObjectId }> {
        const newTemplate = new templateModel(template);
        const result = await newTemplate.save();
        return result;
    }
    async getTemplatesByStepAndOptionalRoleLevel(step: string, role?: string, level?: string): Promise<ITemplateModel | null> {
        const query = { step, ...(role ? { role } : {}), ...(level ? { level } : {}) };
        const result = await templateModel.findOne(query);
        return result;
    }


    async getTemplateById(_id: string): Promise<ITemplateModel | null> {
        const result = await templateModel.findById(_id).populate({
            path: 'group_id'
        });
        return result;
    }


    async updateTemplate(_id: string, template: ITemplateModel): Promise<ITemplateModel | null> {
        const { details, level, role, title, group_id } = template;
        return await templateModel.findOneAndUpdate({ _id }, { details, level, role, title, group_id }, { new: true });
    }

    async deleteTemplate(_id: string): Promise<boolean> {
        const result = await templateModel.deleteOne({ _id });
        return result.deletedCount ? true : false;
    }

    async getUnAttachedTemplate(): Promise<ITemplateModel[]> {
        const result = await templateModel.find({ group_id: null }).select({ title: 1, level: 1, role: 1 });
        return result;
    }

    async addGroupToTemplate(group_id: string, template_ids: string[], session: ClientSession): Promise<void> {
        await templateModel.updateMany({ _id: { $in: template_ids } }, { group_id: group_id }).session(session);
    }

    async getAttachedTemplate(): Promise<ITemplateModel[]> {
        const result = await templateModel.find({ group_id: { $type: 'objectId' } }).select({ title: 1, level: 1, role: 1, group_id: 1 })
        return result;
    }
    async checkTemplateExist(title: string, role: string, level: string, step: string): Promise<boolean> {
        const result = await templateModel.findOne({ title, role, level, step });
        return result ? true : false;
    }


}

const templateService = new TemplateService()
export default templateService;