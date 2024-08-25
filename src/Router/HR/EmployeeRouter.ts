import { Router, Request, Response } from "express";
import systemError from "../../Utils/Error/SystemError";
import EmployeeController from "../../Controller/HR/Employee/EmployeeController";
const EmployeeRouter = Router();

EmployeeRouter.get('/data', async (req: Request, res: Response): Promise<Response> => {
    try {
        const name = (req.query.name) as string || null;
        const department = (req.query.department) as string || null
        const limit = parseInt(req.query.limit as string) || 10
        const skip = parseInt(req.query.skip as string) || 0
        const employeeController = new EmployeeController();
        const result = await employeeController.getAllEmployee(name, department, limit, skip);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return systemError.sendError(res, error);
    }
})

export default EmployeeRouter;