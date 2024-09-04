import { ICreateTaskBody } from "../../../Controller/Task/ITaskController";
import { ICreateEventBody } from "../../../Controller/HR/Event/IEventController";
import IEventModel from "../../../Model/event/IEventModel";

export default interface IEventService {
    createEvent(event: IEventModel | ICreateEventBody | ICreateTaskBody): Promise<IEventModel>;
    getOneEvent(_id: string): Promise<IEventModel | null>;
    getMonthEvents(): Promise<IEventModel[]>;
    getMonthTasks(employee: string): Promise<IEventModel[]>;
    getDepartmentTask(department: string): Promise<IEventModel[]>;
    updateTask(_id: string, articleImg: string, article: string, articleTitle: string, employee: string): Promise<IEventModel | null>;
    editEvent(_id: string, event: IEventModel | ICreateEventBody): Promise<IEventModel | null>;
    deleteEvent(_id: string): Promise<boolean>;
    getBusyTime(employee_id: string, startTime: number, endTime: number): Promise<IEventModel[]>;
}