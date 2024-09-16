import IReceiptModel from "../../../Model/Administrative/Receipt/IReceiptModel";
import receiptService from "../../../Service/Administrative/Receipt/ReceiptService";
import IExpensesController from "./IExpensesController";

class ExpensesController implements IExpensesController {
    async getAccountingExpenses(page: number, limit: number): Promise<IReceiptModel[]> {
        const result = await receiptService.getAllReceipts(page, limit);
        return result;
    }
}

const expensesController = new ExpensesController();

export default ExpensesController;