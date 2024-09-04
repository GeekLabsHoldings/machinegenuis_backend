import { Router, Request, Response } from "express";
import TaskController from "../../Controller/Task/TaskController";
import systemError from "../../Utils/Error/SystemError";
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
export default CalendlyRouter;