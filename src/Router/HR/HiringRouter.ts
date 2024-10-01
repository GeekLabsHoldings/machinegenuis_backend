import { Router, Request, Response } from "express";
import hiringController from "../../Controller/HR/Hiring/HiringController";
import systemError from "../../Utils/Error/SystemError";
import { HiringStatus } from "../../Utils/Hiring";
import mongoose from "mongoose";
const HiringRouter = Router();


HiringRouter.put('/next-step/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const result = await hiringController.toNextStep(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

HiringRouter.get('/hiring', async (req: Request, res: Response): Promise<Response> => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = parseInt(req.query.skip as string) || 0;
        const type = (req.query.type) as string || HiringStatus.ALL
        const result = await hiringController.getHiring(type, limit, skip);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

HiringRouter.get('/current-step-template/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const result = await hiringController.getCurrentStepTemplate(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

HiringRouter.put('/publish-job/:_id', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { _id } = req.params;
        const { role, contract, template, skills, questions } = req.body.details;
        const result = await hiringController.publishJob(_id, role, contract, template, skills, questions, session);
        await session.commitTransaction();
        return res.json(result);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        session.endSession();
    }
})
export default HiringRouter;