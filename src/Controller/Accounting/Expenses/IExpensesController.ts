import IReceiptModel from "../../../Model/Administrative/Receipt/IReceiptModel";

export default interface IExpensesController {
    getAccountingExpenses(page: number, limit: number): Promise<IReceiptModel[]>;
}