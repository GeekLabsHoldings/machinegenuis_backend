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

TicketsRouter.get('/get-tickets', async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const page = parseInt(req.query.page as string) || 0;
        const ticketController = new TicketsController();
        const result = await ticketController.getTickets(limit, page);
        return res.status(200).json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

export default TicketsRouter;