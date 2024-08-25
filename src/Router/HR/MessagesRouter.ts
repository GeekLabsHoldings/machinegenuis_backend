import { Router, Request, Response } from 'express';
import systemError from '../../Utils/Error/SystemError';
import mongoose from 'mongoose';
import EmailController from '../../Controller/HR/Messages/EmailController';

const MessageRouter = Router();


MessageRouter.post('/email/send-message', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { candidate_id, subject, emailContent } = req.body;
        const emailController = new EmailController(session);
        const result = await emailController.sendCandidateMessage(candidate_id, subject, emailContent);
        await session.commitTransaction();
        return res.json(result);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        session.endSession();
    }
})
export default MessageRouter;