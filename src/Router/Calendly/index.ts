import { Router, Request, Response } from "express";
import TaskController from "../../Controller/Task/TaskController";
import systemError from "../../Utils/Error/SystemError";
import mongoose from "mongoose";
const CalendlyRouter = Router();
CalendlyRouter.get('/available-time', async (req: Request, res: Response): Promise<Response> => {
    try {

        const dateNumber = Number(req.query.date);
        const typeString = String(req.query.type);
        const employee_idString = String(req.query.employee_id);
        const taskController = new TaskController();
        const result = await taskController.getFreeTime(dateNumber, typeString, employee_idString);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

CalendlyRouter.post('/create-reservation', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const chosenDate = Number(req.body.chosenDate);
        const invitationDate = Number(req.body.invitationDate);
        const type = String(req.body.type);
        const employee_id = String(req.body.employee_id);
        const candidate_id = String(req.body.candidate_id);
        const taskController = new TaskController();
        const result = await taskController.candidateReserveTime(chosenDate, invitationDate, type, employee_id, candidate_id, session);
        await session.commitTransaction();
        return res.json({ result });
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        session.endSession();
    }
})
export default CalendlyRouter;