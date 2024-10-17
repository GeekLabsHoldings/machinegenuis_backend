import { ClientSession, Types } from "mongoose";
import { ITemplateModel } from "../../../Model/HR/Templates/ITemplateModel";
import templateService from "../../../Service/HR/Template/Template/TemplateService";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import { ITemplateController } from "./ITemplateController";

class TemplateController implements ITemplateController {
    async createTemplate(template: ITemplateModel): Promise<ITemplateModel & { _id: Types.ObjectId }> {
        const checkTemplateExist = await templateService.checkTemplateExist(template.title, template.role, template.level, template.step);
        if (checkTemplateExist)
            return systemError.setStatus(400).setMessage(ErrorMessages.TEMPLATE_EXIST).throw();
        const result = await templateService.createTemplates(template);
        return result;
    }
    async getTemplate(_id: string): Promise<ITemplateModel> {
        const result = await templateService.getTemplateById(_id);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.TEMPLATE_NOT_FOUND).throw();
        return result;
    }
    async updateTemplate(_id: string, template: ITemplateModel): Promise<ITemplateModel> {
        const result = await templateService.updateTemplate(_id, template);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.TEMPLATE_NOT_FOUND).throw();
        return result;
    }

    async getUnAttackedTemplate(): Promise<ITemplateModel[]> {
        const result = await templateService.getUnAttachedTemplate();
        return result;
    }
}

const templateController = new TemplateController();

export default templateController;