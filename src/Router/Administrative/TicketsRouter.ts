import { Request, Response, Router } from "express";
import systemError from "../../Utils/Error/SystemError";
import ITicketsModel from "../../Model/Administrative/Tickets/ITicketsModel";
import moment from "../../Utils/DateAndTime/index"
import TicketsController from "../../Controller/Administrative/Tickets/TicketsController";

const TicketsRouter = Router();

TicketsRouter.post('/create-ticket', async (req: Request, res: Response) => {
    try {
        const ticketData: ITicketsModel = {
            ticketType: req.body.ticketType,
            subjectLine: req.body.subjectLine,
            ticketDescription: req.body.ticketDescription,
            createdAt: moment().valueOf(),
        }
        const ticketController = new TicketsController();
        const result = await ticketController.createTicket(ticketData);
        return res.status(201).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

TicketsRouter.get('/get-tickets', async (_, res) => {
    try {
        const ticketController = new TicketsController();
        const result = await ticketController.getTickets();
        return res.status(200).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

export default TicketsRouter;