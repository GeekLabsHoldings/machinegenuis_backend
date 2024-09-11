import { Router, Request, Response } from "express";
import systemError from "../../Utils/Error/SystemError";
import BankAccountController from "../../Controller/Accounting/BankingAccount/BankingAccountController";
import IBankAccountModel from "../../Model/Accounting/BankAccount/IBankAccountModel";
import moment from "../../Utils/DateAndTime";

const BankAccountsRouter = Router();

BankAccountsRouter.post('/', async (req: Request, res: Response): Promise<Response> => {
    try {
        const bankAccountData: IBankAccountModel = {
            accountName: req.body.accountName,
            accountNumber: req.body.accountNumber,
            ApiConnect: req.body.ApiConnect,
            bankName: req.body.bankName,
            brand: req.body.brand,
            country: req.body.country,
            createdAt: moment().valueOf(),
            IBANumber: req.body.IBANumber,
            password: req.body.password,
            SWIFTCode: req.body.SWIFTCode,
            userName: req.body.userName
        }
        const bankAccountController = new BankAccountController();
        const result = await bankAccountController.createBankAccount(bankAccountData);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})


BankAccountsRouter.get('/', async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const bankAccountController = new BankAccountController();
        const result = await bankAccountController.getBankAccount(page, limit);
        return res.json(result);
    } catch (error) {
        return systemError.sendError(res, error);
    }
})

export default BankAccountsRouter;