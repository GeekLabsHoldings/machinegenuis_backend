import ITicketsModel from "../../../Model/Administrative/Tickets/ITicketsModel";
import TicketsModel from "../../../Model/Administrative/Tickets/TicketsModel";
import ITicketsService from "./ITicketsService";

class TicketsService implements ITicketsService {
    async createTicket(TicketData: ITicketsModel): Promise<ITicketsModel> {
        const ticket = new TicketsModel(TicketData);
        const result = await ticket.save();
        return result;
    }

    async getTickets(): Promise<ITicketsModel[]> {
        const result = await TicketsModel.find()
            .sort({ createdAt: -1 })
            .skip(0)
            .limit(10);
        return result;
    }

}

const ticketService = new TicketsService();

export default ticketService;