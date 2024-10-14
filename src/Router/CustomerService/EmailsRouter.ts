import { Router, Request, Response } from "express";
import CustomerServiceController from "../../Controller/CustomerService/CustomerService";
import systemError from "../../Utils/Error/SystemError";
const EmailCustomerServiceRouter = Router();


EmailCustomerServiceRouter.post('/send-email', async (req: Request, res: Response) => {
    try {
        const brand = req.query.brand as string || null;
        const department = req.query.department as string || null;
        const toAddress = req.body.toAddress;
        const subject = req.body.subject;
        const content = req.body.content;
        const customerServiceController = new CustomerServiceController();
        const result = await customerServiceController.sendEmail(department, brand, toAddress, subject, content);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

EmailCustomerServiceRouter.post('/replay-email', async (req: Request, res: Response) => {
    try {
        const brand = req.query.brand as string || null;
        const department = req.query.department as string || null;
        const toAddress = req.body.toAddress;
        const subject = req.body.subject;
        const content = req.body.content;
        const emailId = req.body.emailId;
        const customerServiceController = new CustomerServiceController();
        const result = await customerServiceController.replayEmail(department, brand, emailId, toAddress, subject, content);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

EmailCustomerServiceRouter.get('/all-emails', async (req: Request, res: Response) => {
    try {
        const brand = req.query.brand as string || null;
        const department = req.query.department as string || null;
        const customerServiceController = new CustomerServiceController();
        const result = await customerServiceController.getAllEmails(department, brand);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

EmailCustomerServiceRouter.get('/email-by-id/:emailId/:folderId', async (req: Request, res: Response) => {
    try {
        const brand = req.query.brand as string || null;
        const department = req.query.department as string || null;
        const { emailId, folderId } = req.params;
        const customerServiceController = new CustomerServiceController();
        const result = await customerServiceController.getEmailById(department, brand, emailId, folderId);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});

EmailCustomerServiceRouter.delete('/delete-email/:emailId/:folderId', async (req: Request, res: Response) => {
    try {
        const brand = req.query.brand as string || null;
        const department = req.query.department as string || null;
        const { emailId, folderId } = req.params;
        const customerServiceController = new CustomerServiceController();
        const result = await customerServiceController.deleteEmail(department, brand, emailId, folderId);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
});


export default EmailCustomerServiceRouter;