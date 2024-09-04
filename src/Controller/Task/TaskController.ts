import IEventModel from "../../Model/event/IEventModel";
import eventService from "../../Service/HR/Event/EventService";
import moment, { AfterDays, EndOfInterviewHour, StartOfInterviewHour } from "../../Utils/DateAndTime";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import { CalendlyAllowedDays, calendlyEnum, CalendlyInterviewDuration, CalendlyInterviewStartEndHour } from "../../Utils/Hiring";
import SuccessMessage from "../../Utils/SuccessMessages";
import ITaskController, { ICreateTaskBody, IInterviewTypeFreeTime } from "./ITaskController";
export default class TaskController implements ITaskController {
    async createTask(task: ICreateTaskBody): Promise<IEventModel> {
        if (task.startNumber > task.endNumber) return systemError.setStatus(406).setMessage(ErrorMessages.END_TIME_MUST_BE_AFTER_START_TIME).throw();
        const result = await eventService.createEvent(task);
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

}