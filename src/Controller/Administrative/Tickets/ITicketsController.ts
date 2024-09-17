import ITicketsModel from "../../../Model/Administrative/Tickets/ITicketsModel";

export default interface ITicketsController {
    createTicket(ticketData: ITicketsModel): Promise<ITicketsModel>;
    getTickets(limit: number, page: number): Promise<ITicketsModel[]>;
}