import { Router, Request, Response } from 'express';
import systemError from '../../Utils/Error/SystemError';
import ComplaintController from '../../Controller/HR/Complaint/ComplaintController';

const ComplaintRouter = Router();


ComplaintRouter.put('/solve/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const complaintController = new ComplaintController();
        const result = await complaintController.solveComplaint(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

ComplaintRouter.get('/get-one/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const complaintController = new ComplaintController();
        const result = await complaintController.getOneComplaint(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})


ComplaintRouter.get('/get-all', async (req: Request, res: Response): Promise<Response> => {
    try {

        const name = (req.query.name as string) || null;
        const department = (req.query.department as string) || null;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = parseInt(req.query.skip as string) || 0;
        const solve = ((req.query.solve as string) === 'true') || false
        const urgencyLevel = (req.query.urgencyLevel as string) || null
        const complaintController = new ComplaintController();
        const result = await complaintController.getAllComplaints(name, department, urgencyLevel, solve, limit, skip);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})


export default ComplaintRouter;