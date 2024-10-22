import { ClientSession, Types } from "mongoose";
import ICandidateModel, { IStepStatus } from "../../../Model/HR/Candidate/ICandidateModel";
import ICandidateController from "./ICandidateController";
import candidateService from "../../../Service/HR/Candidate/CandidateService";
import systemError from "../../../Utils/Error/SystemError";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import { HiringSteps, HiringStepsEnum } from "../../../Utils/GroupsAndTemplates";
import { HiringStatusLevelEnum, StatusEnum } from "../../../Utils/Hiring";
import ICandidateQuestionsModel from "../../../Model/HR/Candidate/ICandidateQuestionsModel";
import candidateQuestionsService from "../../../Service/HR/CandidateQuestion/CandidateQuestionService";
import LinkedinAccountService from "../../../Service/HR/LinkedinAccounts/LinkedinAccountService";
import hiringService from "../../../Service/HR/Hiring/HiringService";
import moment from "../../../Utils/DateAndTime/index";
import axios from "axios";

export default class CandidateController implements ICandidateController {


    async getAllCandidateByHiring(hiring: string, hiringStep: string, limit: number, skip: number): Promise<ICandidateModel[]> {
        return await candidateService.getAllCandidateByHiring(hiring, hiringStep, limit, skip);
    }
    async changeMessageStatus(_id: string, candidate: ICandidateModel, session: ClientSession): Promise<void> {
        const { currentStep, messageStatus } = candidate;
        const currentStepIndex = HiringSteps.indexOf(currentStep as HiringStepsEnum);
        if (currentStepIndex === -1) {
            return systemError.setStatus(404).setMessage(ErrorMessages.CURRENT_STEP_NOT_FOUND).throw();
        }
        if (currentStepIndex === HiringSteps.length - 1)
            return systemError.setStatus(404).setMessage(ErrorMessages.LAST_HIRING_STEP).throw()
        messageStatus[currentStepIndex + 1].status = StatusEnum.APPROVED;
        console.log({ messageStatus });
        const result = await candidateService.changeMessageStatus(_id, messageStatus, session);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.CANDIDATE_NOT_FOUND).throw();
    }

    async changeCurrentStepStatus(_id: string, status: boolean, session: ClientSession): Promise<ICandidateModel> {
        const candidate = await candidateService.getCandidate(_id, session);
        if (!candidate)
            return systemError.setStatus(404).setMessage(ErrorMessages.CANDIDATE_NOT_FOUND).throw();
        const { currentStep, stepsStatus } = candidate;
        const currentStepIndex = HiringSteps.indexOf(currentStep as HiringStepsEnum);
        if (currentStepIndex === -1) {
            return systemError.setStatus(404).setMessage(ErrorMessages.CURRENT_STEP_NOT_FOUND).throw();
        }
        let nextStep = currentStep;
        stepsStatus[currentStepIndex].status = status ? StatusEnum.APPROVED : StatusEnum.REJECTED;
        if (status && currentStepIndex + 1 < HiringSteps.length)
            nextStep = HiringSteps[currentStepIndex + 1];
        const result = await candidateService.changeCurrentStep(_id, nextStep, stepsStatus, session);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.CANDIDATE_NOT_FOUND).throw();
        return result;
    }

    async addCandidateQuestion(question: ICandidateQuestionsModel): Promise<ICandidateQuestionsModel> {
        const result = await candidateQuestionsService.createCandidateQuestions(question);
        return result;
    }
    async getCandidateQuestion(_id: string): Promise<ICandidateQuestionsModel> {
        const result = await candidateQuestionsService.getCandidateQuestions(_id);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.CANDIDATE_ANSWER_NOT_FOUND).throw();
        return result;
    }

    async candidateAddTask(email: string, task_url: string): Promise<ICandidateQuestionsModel> {
        const candidate = await candidateService.getCandidateByEmail(email);
        if (!candidate)
            return systemError.setStatus(404).setMessage(ErrorMessages.CANDIDATE_NOT_FOUND).throw();
        const result = await candidateQuestionsService.candidateSendTask((candidate._id).toString(), task_url);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.CANDIDATE_ANSWER_NOT_FOUND).throw();
        return result;
    }

    async getAllCandidateQuestionsAndTask(department: string): Promise<ICandidateQuestionsModel[]> {
        return await candidateQuestionsService.getAllCandidatesQuestions(department);
    }

    async changeCandidateTaskStatus(_id: string, status: string, session: ClientSession): Promise<ICandidateModel> {
        const candidate = await candidateService.getCandidate(_id, session);
        if (!candidate)
            return systemError.setStatus(404).setMessage(ErrorMessages.CANDIDATE_NOT_FOUND).throw();
        const candidateQuestion = await candidateQuestionsService.ReviewCandidateTask(_id, status, session);
        if (!candidateQuestion)
            return systemError.setStatus(404).setMessage(ErrorMessages.CANDIDATE_ANSWER_NOT_FOUND).throw();
        const { currentStep } = candidate;
        const nextStepStatus = status === StatusEnum.APPROVED ? true : false
        if (!nextStepStatus || nextStepStatus && (currentStep === HiringStepsEnum.Tasks)) {
            const result = await this.changeCurrentStepStatus(_id, nextStepStatus, session);
            return result;
        }
        return candidate;
    }

    async getAllCandidate(role: string | null, limit: number, skip: number): Promise<ICandidateModel[]> {
        return await candidateService.getAll(role, limit, skip);
    }

    async getCandidateFromLinkedin(): Promise<void> {
        const linkedinAccountsService = new LinkedinAccountService();
        const busyAccounts = await linkedinAccountsService.getBusyAccounts();
        console.log("busyAccounts", busyAccounts);
        if (busyAccounts.length === 0)
            return;
        const setupAxios = axios.create({
            baseURL: 'https://linkedin-scrape.machinegenius.io',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            timeout: (60 * 60 * 1000)
        })
        const status = [
            {
                step: HiringStepsEnum.REQUEST_HIRING,
                status: StatusEnum.APPROVED
            },
            {
                step: HiringStepsEnum.Job_Listings,
                status: StatusEnum.APPROVED
            },
            {
                step: HiringStepsEnum.Get_Job_Candidates,
                status: StatusEnum.APPROVED
            },
            {
                step: HiringStepsEnum.Schedule_Interview_Call,
                status: StatusEnum.PENDING
            },
            {
                step: HiringStepsEnum.Interview_Call_Question,
                status: StatusEnum.PENDING
            },
            {
                step: HiringStepsEnum.Tasks,
                status: StatusEnum.PENDING
            },
            {
                step: HiringStepsEnum.Schedule_Face_To_Face_Interview,
                status: StatusEnum.PENDING
            },
            {
                step: HiringStepsEnum.Job_Offer,
                status: StatusEnum.PENDING
            },
            {
                step: HiringStepsEnum.Required_Documents,
                status: StatusEnum.PENDING
            },
        ]
        for (const account of busyAccounts) {
            const hiring = await hiringService.getHiringByLinkedinAccount((account._id).toString());
            if (!hiring) {
                console.log("Hiring not found");
                continue;
            }
            console.log("hiring", hiring.currentStep);
            const candidate = await setupAxios.get(`/linkedin/candidate/${account._id}`);

            if (!candidate)
                continue;
            for (const item of candidate.data) {
                if (item.phone.startsWith("+200")) {
                    item.phone = item.phone.replace("+200", "+20");
                }
                const candidateData: ICandidateModel = {
                    firstName: item.name.split(' ')[0],
                    lastName: item.name.split(' ')[1],
                    email: item.email,
                    phoneNumber: item.phone,
                    linkedIn: item.profileLink,
                    cvLink: item.cvPath,
                    role: hiring.role,
                    currentStep: HiringStepsEnum.Get_Job_Candidates,
                    hiring: new Types.ObjectId(hiring._id),
                    stepsStatus: status,
                    messageStatus: status,
                    portfolio: "",
                    department: hiring.department,
                    appliedFrom: "Linkedin",
                    createdAt: moment().valueOf(),
                    recommendation: null
                }
                await candidateService.createCandidate(candidateData);
            };
            await hiringService.changeHiringStatus((hiring._id).toString(), HiringStatusLevelEnum.CONTINUE);
        };
    }
}
