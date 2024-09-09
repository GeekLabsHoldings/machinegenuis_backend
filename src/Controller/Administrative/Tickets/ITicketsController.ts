import ITicketsModel from "../../../Model/Administrative/Tickets/ITicketsModel";

export default interface ITicketsController {
    createTicket(ticketData: ITicketsModel): Promise<ITicketsModel>;
    getTickets(): Promise<ITicketsModel[]>;
}