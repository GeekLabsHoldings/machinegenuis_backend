import { Router, Request, Response } from 'express';
import systemError from '../../Utils/Error/SystemError';
import PayrollController from '../../Controller/Accounting/Payroll/PayrollController';

const PayrollRouter = Router();

PayrollRouter.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const payrollController = new PayrollController();
        const result = await payrollController.getAccountingPayroll(page, limit);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

export default PayrollRouter;