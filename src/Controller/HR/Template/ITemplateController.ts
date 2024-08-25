import { ClientSession, Types } from "mongoose";
import { ITemplateModel } from "../../../Model/HR/Templates/ITemplateModel";

export interface ITemplateController {
    createTemplate(template: ITemplateModel, group_id: string, session: ClientSession): Promise<ITemplateModel & { _id: Types.ObjectId }>;
    getTemplate(_id: string): Promise<ITemplateModel>;
    updateTemplate(_id: string, template: ITemplateModel): Promise<ITemplateModel>;
    getUnAttackedTemplate(): Promise<ITemplateModel[]>;
}