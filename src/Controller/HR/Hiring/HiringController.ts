import IHiringModel from "../../../Model/HR/Hiring/IHiringModel";
import hiringService from "../../../Service/HR/Hiring/HiringService";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import IHiringController, { IQuestionTemplate, IStepsOfHiring } from "./IHiringController";
import SuccessMessage from "../../../Utils/SuccessMessages";
import templateService from "../../../Service/HR/Template/Template/TemplateService";
import { HiringStatusLevelEnum } from "../../../Utils/Hiring";
import { HiringSteps, HiringStepsEnum } from "../../../Utils/GroupsAndTemplates";
import { ClientSession } from "mongoose";
import axios from "axios";
import candidateService from "../../../Service/HR/Candidate/CandidateService";

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


    async getCurrentStepTemplate(_id: string, requestCurrentStep: string | null): Promise<IStepsOfHiring> {
        const hiring = await hiringService.getOneHiring(_id)
        if (!hiring)
            return systemError.setStatus(404).setMessage(ErrorMessages.HIRING_NOT_FOUND).throw();
        const { level, role } = hiring
        const currentStep = requestCurrentStep || hiring.currentStep;
        const query = [HiringStepsEnum.Interview_Call_Question, HiringStepsEnum.Tasks, HiringStepsEnum.Job_Listings].includes(currentStep as HiringStepsEnum);

        const template = await templateService.getTemplatesByStepAndOptionalRoleLevel(currentStep, (query ? role : undefined), (query ? level : undefined));
        const candidate = await candidateService.getAllCandidateByHiring(_id, currentStep, null, null);
        return {
            _id,
            step: currentStep,
            level,
            role,
            template,
            candidates: candidate
        };

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
        console.log("data", data);
        const apis = axios.create({
            baseURL: 'https://linkedin-scrape.machinegenius.io',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: (60 * 60 * 1000)
        });
        const result = await apis.post('/linkedin/post-job', data);
        console.log("===================>", result.data);
        const _id = result.data;
        await hiringService.addHiringLinkedinAccount(hiringId, _id, session);
        return "Job Published Successfully";
    }


}

const hiringController = new HiringController();

export default hiringController;