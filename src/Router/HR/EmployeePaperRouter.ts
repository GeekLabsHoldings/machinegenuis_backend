import { Router, Request, Response } from "express";
import systemError from "../../Utils/Error/SystemError";
import EmployeePaperController from "../../Controller/HR/EmployeePaper/EmployeePaperController";

const EmployeePaperRouter = Router();

EmployeePaperRouter.put('/edit-paper/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const paper = req.body.paper;
        const employeePaperController = new EmployeePaperController()
        const result = await employeePaperController.editEmployeePaper(_id, paper);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})


EmployeePaperRouter.get('/get-paper', async (req: Request, res: Response): Promise<Response> => {
    try {
        const name = (req.query.name) as string || null;
        const department = (req.query.department) as string || null;
        const limit = parseInt(req.query.limit as string) || 10
        const skip = parseInt(req.query.skip as string) || 0
        const employeePaperController = new EmployeePaperController()
        const result = await employeePaperController.getAllEmployeePaper(name, department, limit, skip);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

export default EmployeePaperRouter;