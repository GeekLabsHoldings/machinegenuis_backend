import ITicketsModel from "../../../Model/Administrative/Tickets/ITicketsModel";

export default interface ITicketsService {
    createTicket(TicketData: ITicketsModel): Promise<ITicketsModel>;
    getTickets(limit: number, page: number): Promise<ITicketsModel[]>;
}