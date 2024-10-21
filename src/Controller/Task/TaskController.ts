import { ClientSession } from "mongoose";
import IEventModel from "../../Model/event/IEventModel";
import candidateService from "../../Service/HR/Candidate/CandidateService";
import eventService from "../../Service/HR/Event/EventService";
import moment, { AfterDays, EndOfInterviewHour, StartOfInterviewHour } from "../../Utils/DateAndTime";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import { CalendlyAllowedDays, calendlyEnum, CalendlyInterviewDuration, CalendlyInterviewStartEndHour, StatusEnum } from "../../Utils/Hiring";
import SuccessMessage from "../../Utils/SuccessMessages";
import ITaskController, { ICreateTaskBody, IInterviewTypeFreeTime } from "./ITaskController";
import { HiringStepsEnum } from "../../Utils/GroupsAndTemplates";
import CandidateController from "../HR/Candidate/CandidateController";
export default class TaskController implements ITaskController {
    async createTask(task: ICreateTaskBody, session: ClientSession): Promise<IEventModel> {
        if (task.startNumber > task.endNumber) return systemError.setStatus(406).setMessage(ErrorMessages.END_TIME_MUST_BE_AFTER_START_TIME).throw();
        const result = await eventService.createEvent(task, session);
        return result;
    }
    async editTask(_id: string, task: ICreateTaskBody): Promise<IEventModel> {
        const result = await eventService.editEvent(_id, task);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.TASK_NOT_FOUND).throw();
        return result;
    }
    async getDepartmentTask(department: string): Promise<IEventModel[]> {
        return await eventService.getDepartmentTask(department);
    }
    async getMyTask(employee: string): Promise<IEventModel[]> {

        return await eventService.getMonthTasks(employee);
    }
    async updateTask(_id: string, article: { article: string; articleImg: string; articleTitle: string; }, employee: string): Promise<IEventModel> {
        const result = await eventService.updateTask(_id, article.articleImg, article.article, article.articleTitle, employee);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.TASK_NOT_FOUND).throw();
        return result;
    }

    async getOneTask(_id: string): Promise<IEventModel> {
        const result = await eventService.getOneEvent(_id);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.TASK_NOT_FOUND).throw();
        return result;
    }

    async deleteTask(_id: string): Promise<string> {
        const result = await eventService.deleteEvent(_id);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.TASK_NOT_FOUND).throw();
        return SuccessMessage.DELETED_SUCCESSFULLY;
    }

    async getFreeTime(date: number, type: string, employee_id: string): Promise<IInterviewTypeFreeTime[]> {
        const now = moment(date);
        if (now.day() !== moment().day()) return systemError.setStatus(406).setMessage(ErrorMessages.EXPIRE_INVITATION).throw();

        now.add(1, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const allowDays =
            type === calendlyEnum.FaceToFace ?
                CalendlyAllowedDays.FaceToFace : type === calendlyEnum.PhoneCall ?
                    CalendlyAllowedDays.PhoneCall : 0;
        const afterDays = AfterDays(now, allowDays);
        const busyTime = await eventService.getBusyTime(employee_id, now.valueOf(), afterDays);
        const duration =
            type === calendlyEnum.FaceToFace ?
                CalendlyInterviewDuration.FaceToFace : type === calendlyEnum.PhoneCall ?
                    CalendlyInterviewDuration.PhoneCall : 0;
        const startInterviewHour =
            type === calendlyEnum.FaceToFace ?
                CalendlyInterviewStartEndHour.FaceToFace.start : type === calendlyEnum.PhoneCall ?
                    CalendlyInterviewStartEndHour.PhoneCall.start : 0;
        const endInterviewHour =
            type === calendlyEnum.FaceToFace ?
                CalendlyInterviewStartEndHour.FaceToFace.end : type === calendlyEnum.PhoneCall ?
                    CalendlyInterviewStartEndHour.PhoneCall.end : 0;
        const freeTime = [];
        let countDays = 0;
        for (let i = 0; i < allowDays; i++) {
            const day = now.day();
            if (countDays === allowDays - 2) break;
            if (day === 5 || day === 6) {
                now.add(1, 'days');
                continue;
            }
            const startOfDay = StartOfInterviewHour(now, startInterviewHour)
            const endOfDay = EndOfInterviewHour(now, endInterviewHour);
            for (let j = startOfDay; j < endOfDay; j += duration * 60 * 1000) {
                const startInterview = j;
                const endInterview = j + duration * 60 * 1000;
                const isBusy = busyTime.find(e => {
                    if (e.endNumber <= startInterview || e.startNumber >= endInterview) return false;
                    return true;
                });
                if (!isBusy) {
                    freeTime.push({ startTime: startInterview, endTime: endInterview });
                }
            }
            now.add(1, 'days');
            countDays++;
        }
        return freeTime;
    }

    async candidateReserveTime(chosenDate: number, invitationDate: number, type: string, employee_id: string, candidate_id: string, session: ClientSession): Promise<IEventModel> {
        const duration =
            type === calendlyEnum.FaceToFace ?
                CalendlyInterviewDuration.FaceToFace : type === calendlyEnum.PhoneCall ?
                    CalendlyInterviewDuration.PhoneCall : 0;
        const endTime = chosenDate + duration * 60 * 1000;
        // check day is more then invitation date by 1 day at least and 5 or 3 by type
        const invitation = moment(invitationDate);
        const chosen = moment(chosenDate);
        const allowDays =
            type === calendlyEnum.FaceToFace ?
                CalendlyAllowedDays.FaceToFace : type === calendlyEnum.PhoneCall ?
                    CalendlyAllowedDays.PhoneCall : 0;
        const afterDays = AfterDays(invitation, allowDays);
        console.log("============= check day validation ==============");
        if (chosen <= invitation || chosen.day() > afterDays || chosen.day() === 5 || chosen.day() === 6)
            return systemError.setStatus(406).setMessage(ErrorMessages.EXPIRE_INVITATION).throw();
        // check time inside interview hours 
        const startHour = chosen.hour();
        const checkTime = type === calendlyEnum.FaceToFace ?
            startHour >= CalendlyInterviewStartEndHour.FaceToFace.start && startHour < CalendlyInterviewStartEndHour.FaceToFace.end :
            type === calendlyEnum.PhoneCall ?
                startHour >= CalendlyInterviewStartEndHour.PhoneCall.start && startHour < CalendlyInterviewStartEndHour.PhoneCall.end : false;
        console.log("============= check time validation ==============");
        if (!checkTime) return systemError.setStatus(406).setMessage(ErrorMessages.TIME_NOT_AVAILABLE).throw();

        // check if candidate exist and current step Schedule_Interview_Call or Schedule_Face_To_Face_Interview and message status for two steps  approved and step status for two steps approved 
        const getCandidate = await candidateService.getCandidate(candidate_id, session);
        if (!getCandidate) return systemError.setStatus(404).setMessage(ErrorMessages.CANDIDATE_NOT_FOUND).throw()
        const checkCurrentStep =
            getCandidate.currentStep === HiringStepsEnum.Schedule_Interview_Call && type === calendlyEnum.PhoneCall ||
            getCandidate.currentStep === HiringStepsEnum.Schedule_Face_To_Face_Interview && type === calendlyEnum.FaceToFace;
        const currentStepIndex = getCandidate.stepsStatus.findIndex(e => e.step === getCandidate.currentStep);
        const checkStepStatus = getCandidate.stepsStatus[currentStepIndex].status === StatusEnum.APPROVED;
        const checkMessageStatus = getCandidate.messageStatus[currentStepIndex].status === StatusEnum.APPROVED;
        console.log("============= check candidate validation ==============");
        console.log({
            currentStepIndex,
            checkCurrentStep,
            checkStepStatus,
            checkMessageStatus
        })
        if (!checkStepStatus || !checkCurrentStep || !checkMessageStatus)
            return systemError.setStatus(406).setMessage(ErrorMessages.CANDIDATE_NOT_FOUND).throw();

        //const getEvent = await eventService.getEventByCandidate(candidate_id);
        const checkAvailableTime = await eventService.getBusyTime(employee_id, chosenDate, endTime);
        console.log("============= check available time ==============");
        if (checkAvailableTime.length > 0) return systemError.setStatus(406).setMessage(ErrorMessages.TIME_NOT_AVAILABLE).throw();
        console.log("============= create event ==============");
        const result = await eventService.createEvent({
            title: `${getCandidate.firstName} ${getCandidate.lastName} ${type} interview`,
            assignedTo: employee_id,
            createdBy: employee_id,
            startNumber: chosenDate,
            description: `Role: ${getCandidate.role} - ${getCandidate.currentStep}`,
            articleTitle: `${getCandidate.firstName} ${getCandidate.lastName} ${type} interview`,
            endNumber: endTime,
            start: moment(chosenDate).format("YYYY-MM-DDTHH:mm:ss"),
            end: moment(chosenDate).format("YYYY-MM-DDTHH:mm:ss"),
            backgroundColor: type === calendlyEnum.FaceToFace ? "#00b8ff" : "#005700"
        }, session);
        const candidateController = new CandidateController();
        await candidateController.changeCurrentStepStatus(candidate_id, true, session);

        return result;
    }

}