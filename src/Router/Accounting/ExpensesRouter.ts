import { Router, Request, Response } from "express";
import systemError from "../../Utils/Error/SystemError";
import ExpensesController from "../../Controller/Accounting/Expenses/ExpensesController";

const ExpensesRouter = Router();

ExpensesRouter.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const expensesController = new ExpensesController();
        const result = await expensesController.getAccountingExpenses(page, limit);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

export default ExpensesRouter;