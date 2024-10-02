import IHiringModel from "../../../Model/HR/Hiring/IHiringModel";
import hiringService from "../../../Service/HR/Hiring/HiringService";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import IHiringController, { IQuestionTemplate } from "./IHiringController";
import SuccessMessage from "../../../Utils/SuccessMessages";
import templateService from "../../../Service/HR/Template/Template/TemplateService";
import { HiringStatusLevelEnum } from "../../../Utils/Hiring";
import { ITemplateModel } from "../../../Model/HR/Templates/ITemplateModel";
import { HiringSteps, HiringStepsEnum } from "../../../Utils/GroupsAndTemplates";
import { ClientSession } from "mongoose";
import axios from "axios";

class HiringController implements IHiringController {
    async createHiring(hiring: IHiringModel): Promise<IHiringModel> {
        const result = await hiringService.createHiring(hiring);
        return result;
    }


    async getHiring(type: string, limit: number, skip: number): Promise<IHiringModel[]> {
        return await hiringService.getHiring(type, limit, skip);
    }


    async deleteHiringRequest(_id: string): Promise<string> {
        const result = await hiringService.deleteHiringRequest(_id);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.HIRING_NOT_FOUND).throw();
        return SuccessMessage.DELETED_SUCCESSFULLY;
    }

    async toNextStep(_id: string): Promise<IHiringModel> {
        const hiring = await hiringService.getOneHiring(_id);
        if (!hiring)
            return systemError.setStatus(404).setMessage(ErrorMessages.HIRING_NOT_FOUND).throw();
        const { currentStep } = hiring;
        const currentStepIndex = HiringSteps.indexOf(currentStep as HiringStepsEnum);
        if (currentStepIndex === -1)
            return systemError.setStatus(404).setMessage(ErrorMessages.CURRENT_STEP_NOT_FOUND).throw();

        let hiringStatus = HiringStatusLevelEnum.CONTINUE;
        let nextStep = currentStep;
        if (currentStepIndex + 1 === HiringSteps.length)
            hiringStatus = HiringStatusLevelEnum.COMPLETE;

        if (currentStepIndex + 1 < HiringSteps.length)
            nextStep = HiringSteps[currentStepIndex + 1];
        const result = await hiringService.changeHiringStep(_id, nextStep, hiringStatus);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.HIRING_NOT_FOUND).throw();
        return result;
    }


    async getCurrentStepTemplate(_id: string): Promise<ITemplateModel[]> {
        const hiring = await hiringService.getOneHiring(_id)
        if (!hiring)
            return systemError.setStatus(404).setMessage(ErrorMessages.HIRING_NOT_FOUND).throw();
        const { currentStep, level, role } = hiring
        if (currentStep === HiringStepsEnum.Interview_Call_Question || currentStep === HiringStepsEnum.Job_Listings) {
            const template = await templateService.getTemplatesByRoleLevelStep(role, level, currentStep);
            if (!template)
                return systemError.setStatus(404).setMessage(ErrorMessages.TEMPLATE_NOT_FOUND).throw();
            return template;
        }

        const result = await templateService.getTemplateByStep(currentStep);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.TEMPLATE_NOT_FOUND).throw();
        return result;
    }

    async publishJob(hiringId: string, role: string, contract: string, template: string, skills: Array<string>, questions: Array<IQuestionTemplate>, session: ClientSession): Promise<string> {
        const data = {
            details: {
                jobTitle: role,
                contract_type: contract,
                skills,
                description: template,
                questions

            }
        };
        const result = await axios.post('http://44.201.202.233/linkedin/post-job', data, { headers: { 'Content-Type': 'application/json' } });
        const _id = result.data;
        await hiringService.addHiringLinkedinAccount(hiringId, _id, session);
        return "Job Published Successfully";
    }


}

const hiringController = new HiringController();

export default hiringController;