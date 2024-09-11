import { Router, Request, Response } from 'express';
import ReceiptController from '../../Controller/Administrative/Receipt/ReceiptController';
import systemError from '../../Utils/Error/SystemError';
import IReceiptModel from '../../Model/Administrative/Receipt/IReceiptModel';
import moment from "../../Utils/DateAndTime";

const ReceiptRouter = Router();


ReceiptRouter.get('/presigned-url', async (req: Request, res: Response) => {
    try {
        const receiptController = new ReceiptController();
        const result = await receiptController.generateReceiptPresignedUrl();
        return res.json({ presignedURL: result, receiptUrl: result.split("?")[0] });
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

ReceiptRouter.post('/', async (req: Request, res: Response) => {
    try {
        const receiptData: IReceiptModel = {
            receiptUrl: req.body.receiptUrl,
            totalPrice: req.body.totalPrice,
            employee: req.body.currentUser,
            createdAt: moment().valueOf()
        }
        const receiptController = new ReceiptController();
        const result = await receiptController.createReceipt(receiptData);
        return res.json({ result });
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

ReceiptRouter.get('/', async (req: Request, res: Response) => {
    try {
        const receiptController = new ReceiptController();
        const result = await receiptController.getAllReceipts(parseInt(req.query.page as string), parseInt(req.query.limit as string));
        return res.json({ result });
    } catch (error) {
        return systemError.sendError(res, error);
    }
});


export default ReceiptRouter;