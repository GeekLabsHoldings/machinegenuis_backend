import { Router, Request, Response } from 'express';
import systemError from '../../Utils/Error/SystemError';
import IComplaintModel from '../../Model/HR/Complaint/IComplaintModel';
import { UrgencyLevelEnum } from '../../Utils/Level';
import ComplaintController from '../../Controller/HR/Complaint/ComplaintController';

const CreateComplaintRouter = Router();
CreateComplaintRouter.post('/create', async (req: Request, res: Response): Promise<Response> => {
    try {
        const complaint: IComplaintModel = {
            complaintIssue: req.body.complaintIssue,
            description: req.body.description,
            employee: req.body.decodedToken._id,
            urgencyLevel: req.body.urgencyLevel || UrgencyLevelEnum.LOW,
            solved: false,
            createdAt: Date.now()
        }
        const complaintController = new ComplaintController();
        const result = await complaintController.createComplaint(complaint)
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

export default CreateComplaintRouter;