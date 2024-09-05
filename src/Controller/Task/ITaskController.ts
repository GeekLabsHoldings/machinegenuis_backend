import { ClientSession } from "mongoose";
import IEventModel from "../../Model/event/IEventModel";
import { ICreateEventBody } from "../HR/Event/IEventController";

export interface ICreateTaskBody extends ICreateEventBody {
    assignedTo: string
}

export interface IInterviewTypeFreeTime {
    startTime: number,
    endTime: number
}

export default interface ITaskController {
    createTask(task: ICreateTaskBody, session: ClientSession): Promise<IEventModel>;
    editTask(_id: string, task: ICreateTaskBody): Promise<IEventModel>;
    getDepartmentTask(department: string): Promise<IEventModel[]>;
    getMyTask(employee: string): Promise<IEventModel[]>;
    updateTask(_id: string, article: { article: string, articleImg: string, articleTitle: string }, employee: string): Promise<IEventModel>;
    getOneTask(_id: string): Promise<IEventModel>;
    deleteTask(_id: string): Promise<string>;
    getFreeTime(date: number, type: string, employee_id: string): Promise<IInterviewTypeFreeTime[]>;
    candidateReserveTime(chosenDate: number, invitationDate: number, type: string, employee_id: string, candidate_id: string, session: ClientSession): Promise<IEventModel>
}
