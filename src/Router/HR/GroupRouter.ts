import { Router, Request, Response } from 'express';
import groupController from '../../Controller/HR/Template/GroupController';
import systemError from '../../Utils/Error/SystemError';
import mongoose from 'mongoose';
import SuccessMessage from '../../Utils/SuccessMessages';
const GroupRouter = Router();

GroupRouter.post('/create', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const body = req.body;
        const result = await groupController.createGroup(body, session);
        await session.commitTransaction();
        return res.status(201).json(result);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        session.endSession();
    }
});

GroupRouter.put('/rearrange-position', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { groupPosition } = req.body;
        const result = await groupController.updatePosition(groupPosition, session);
        await session.commitTransaction();
        return res.json(result);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        session.endSession();
    }
})

GroupRouter.put('/edit/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const { body } = req;
        const result = await groupController.updateGroup(_id, body);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})


GroupRouter.put('/add-template-to-group/:_id', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { _id } = req.params;
        const { templates } = req.body;
        const result = await groupController.addTemplateToGroup(_id, templates, session);
        await session.commitTransaction();
        return res.json(result);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        session.endSession();
    }
})

GroupRouter.get('/groups-template', async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await groupController.getAllGroupWithTemplates();
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

GroupRouter.get('/groups/:step', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { step } = req.params;
        const result = await groupController.getAllGroup(step);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

GroupRouter.delete('/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        await groupController.deleteGroup(_id);
        return res.json(SuccessMessage.DELETED_SUCCESSFULLY);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

export default GroupRouter;