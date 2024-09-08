import { Router, Request, Response } from 'express';
import systemError from '../../Utils/Error/SystemError';
import moment from '../../Utils/DateAndTime';
import { ICreateEventBody } from '../../Controller/HR/Event/IEventController';
import EventController from '../../Controller/HR/Event/EventController';
import mongoose from 'mongoose';

const EventRouter = Router();

EventRouter.post('/create', async (req: Request, res: Response): Promise<Response> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const event: ICreateEventBody = {
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            startNumber: moment(req.body.start, 'YYYY-MM-DD').startOf('day').valueOf(),
            endNumber: moment(req.body.end, 'YYYY-MM-DD').endOf('day').valueOf(),
            createdBy: req.body.currentUser._id,
            backgroundColor: req.body.backgroundColor,
        }
        const eventController = new EventController();
        const result = await eventController.createEvent(event, session);
        await session.commitTransaction();
        return res.json(result);
    } catch (error) {
        await session.abortTransaction();
        return systemError.sendError(res, error);
    } finally {
        session.endSession();
    }
});


EventRouter.put('/edit-event/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const event: ICreateEventBody = {
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            startNumber: moment(req.body.start, 'YYYY-MM-DD').startOf('day').valueOf(),
            endNumber: moment(req.body.end, 'YYYY-MM-DD').endOf('day').valueOf(),
            createdBy: req.body.currentUser._id,
            backgroundColor: req.body.backgroundColor,
        }
        const eventController = new EventController();
        const result = await eventController.editEvent(_id, event);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})


EventRouter.delete('/delete/:_id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { _id } = req.params;
        const eventController = new EventController();
        const result = await eventController.deleteEvent(_id);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

export default EventRouter;