import moment from "moment";
import IEventModel from "../../../Model/event/IEventModel";
import eventService from "../../../Service/HR/Event/EventService";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import IEventController, { ICreateEventBody } from "./IEventController";
import { EndOfMonth, StartOfMonth } from "../../../Utils/DateAndTime";
import SuccessMessage from "../../../Utils/SuccessMessages";

export default class EventController implements IEventController {
    async createEvent(event: ICreateEventBody): Promise<IEventModel> {
        const result = await eventService.createEvent(event);
        return result;
    }
    async getOneEvent(_id: string): Promise<IEventModel> {
        const result = await eventService.getOneEvent(_id);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.EVENT_NOT_FOUND).throw();
        return result;
    }
    async getMonthEvents(): Promise<IEventModel[]> {
        const result = await eventService.getMonthEvents();
        return result;
    }
    async editEvent(_id: string, event: ICreateEventBody): Promise<IEventModel> {
        const result = await eventService.editEvent(_id, event);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.EVENT_NOT_FOUND).throw();
        return result;
    }
    async deleteEvent(_id: string): Promise<string> {
        const result = await eventService.deleteEvent(_id);
        if (!result)
            return systemError.setStatus(404).setMessage(ErrorMessages.EVENT_NOT_FOUND).throw();
        return SuccessMessage.DELETED_SUCCESSFULLY;
    }

}