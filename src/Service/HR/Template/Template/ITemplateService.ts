import { ClientSession, Types } from "mongoose";
import { ITemplateModel } from "../../../../Model/HR/Templates/ITemplateModel";

export interface ITemplateService {
    createTemplates(template: ITemplateModel): Promise<ITemplateModel & { _id: Types.ObjectId }>;
    getTemplatesByRoleLevelStep(role: string, level: string, step: string): Promise<ITemplateModel[] | null>;
    getTemplateById(_id: string): Promise<ITemplateModel | null>;
    updateTemplate(_id: string, template: ITemplateModel): Promise<ITemplateModel | null>;
    deleteTemplate(_id: string): Promise<boolean>;
    getUnAttachedTemplate(): Promise<ITemplateModel[]>;
    addGroupToTemplate(group_id: string, template_ids: string[], session: ClientSession): Promise<void>;
    getAttachedTemplate(): Promise<ITemplateModel[]>;
    getTemplateByStep(step: string): Promise<ITemplateModel[]>
}