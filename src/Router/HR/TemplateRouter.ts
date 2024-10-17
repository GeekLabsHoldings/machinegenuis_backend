import { Router, Request, Response } from 'express';
import systemError from '../../Utils/Error/SystemError';
import templateController from '../../Controller/HR/Template/TemplateController';
import { ITemplateModel } from '../../Model/HR/Templates/ITemplateModel';
import mongoose from 'mongoose';

const TemplateRouter = Router();

TemplateRouter.post('/create', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const template: ITemplateModel = {
            details: req.body.details,
            level: req.body.level || null,
            role: req.body.role || null,
            title: req.body.title,
            group_id: req.body.group_id || null,
            step: req.body.step
        }
        const result = await templateController.createTemplate(template);
        await session.commitTransaction();
        return res.status(201).json(result);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        session.endSession();
    }
});



TemplateRouter.put('/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const template: ITemplateModel = {
            details: req.body.details,
            level: req.body.level || null,
            role: req.body.role || null,
            title: req.body.title,
            group_id: req.body.group_id,
            step: req.body.step
        }
        const result = await templateController.updateTemplate(_id, template);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})
TemplateRouter.get('/un-attached', async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await templateController.getUnAttackedTemplate();
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})
TemplateRouter.get('/one-template/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const result = await templateController.getTemplate(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});


export default TemplateRouter;