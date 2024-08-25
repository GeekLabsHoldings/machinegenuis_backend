import IEventModel from "../../Model/event/IEventModel";
import eventService from "../../Service/HR/Event/EventService";
import moment, { EndOfMonth, StartOfMonth } from "../../Utils/DateAndTime";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import SuccessMessage from "../../Utils/SuccessMessages";
import ITaskController, { ICreateTaskBody } from "./ITaskController";

export default class TaskController implements ITaskController {
    async createTask(task: ICreateTaskBody): Promise<IEventModel> {
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
        const result = await eventService.updateTask(_id, article.articleImg, article.article, article.articleTitle,employee);
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

}