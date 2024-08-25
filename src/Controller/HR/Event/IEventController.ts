import IEventModel from "../../../Model/event/IEventModel";
export interface ICreateEventBody {
    title: string,
    start: string,
    end: string,
    startNumber: number,
    endNumber: number,
    backgroundColor: string,
    createdBy: string
}

export default interface IEventController {
    createEvent(event: ICreateEventBody): Promise<IEventModel>;
    getOneEvent(_id: string): Promise<IEventModel>;
    getMonthEvents(date: number): Promise<IEventModel[]>;
    editEvent(_id: string, event: ICreateEventBody): Promise<IEventModel>;
    deleteEvent(_id: string): Promise<string>
}