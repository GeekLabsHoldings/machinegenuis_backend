import { Router, Request, Response } from 'express';
import systemError from '../../Utils/Error/SystemError';
import CandidateController from '../../Controller/HR/Candidate/CandidateController';

const candidateTaskRouter = Router();

candidateTaskRouter.post('/', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, taskUrl } = req.body;
        const candidateController = new CandidateController();
        const result = await candidateController.candidateAddTask(email, taskUrl);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})
export default candidateTaskRouter;