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
    async getTemplatesByRoleLevelStep(role: string, level: string, step: string): Promise<ITemplateModel[]> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    role: { $eq: role },
                    level: { $eq: level }
                }
            },
            {
                $lookup: {
                    from: 'groups',
                    localField: 'group_id',
                    foreignField: '_id',
                    as: 'group'
                }
            },
            {
                $unwind: {
                    path: '$group',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    'group.step': { $eq: step }
                }
            },
            {
                $project: {
                    title: 1,
                    level: 1,
                    details: 1,
                    role: 1
                }
            }
        ]
        const result = await templateModel.aggregate(pipeline);
        return result[0];
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

    async getTemplateByStep(step: string): Promise<ITemplateModel[]> {
        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: 'groups',
                    localField: 'group_id',
                    foreignField: '_id',
                    as: 'group'
                }
            },
            {
                $unwind: {
                    path: '$group',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    'group.step': { $eq: step }
                }
            },
            {
                $project: {
                    title: 1,
                    level: 1,
                    details: 1,
                    role: 1
                }
            }
        ]
        const result = await templateModel.aggregate(pipeline);
        return result;
    }
}

const templateService = new TemplateService()
export default templateService;