import ITicketsModel from "../../../Model/Administrative/Tickets/ITicketsModel";
import ITicketsService from "../../../Service/Administrative/Tickets/ITicketsService";
import ticketService from "../../../Service/Administrative/Tickets/TicketService";
import ITicketsController from "./ITicketsController";

export default class TicketsController implements ITicketsController {
    private ticketService: ITicketsService;
    constructor() {
        this.ticketService = ticketService;
    }
    async createTicket(ticketData: ITicketsModel): Promise<ITicketsModel> {
        return await this.ticketService.createTicket(ticketData);
    }
    async getTickets(): Promise<ITicketsModel[]> {
        return await this.ticketService.getTickets();
    }
}