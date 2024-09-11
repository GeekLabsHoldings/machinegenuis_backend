import { Router, Request, Response } from 'express';
import systemError from '../../Utils/Error/SystemError';
import ISubscriptionsModel from '../../Model/Accounting/Subscriptions/ISubscriptionsModel';
import moment from '../../Utils/DateAndTime';
import SubscriptionController from '../../Controller/Accounting/Subscriptions/SubscriptionsController';

const SubscriptionsRouter = Router();


SubscriptionsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const subscriptionBody: ISubscriptionsModel = {
            subscriptionName: req.body.subscriptionName,
            subscriptionPrice: req.body.subscriptionPrice,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            createdAt: moment().valueOf()
        }
        const subscriptionController = new SubscriptionController();
        const result = await subscriptionController.createAccountingSubscriptions(subscriptionBody);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

SubscriptionsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const subscriptionController = new SubscriptionController();

        const result = await subscriptionController.getAccountingSubscriptions(page, limit);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});


export default SubscriptionsRouter;
