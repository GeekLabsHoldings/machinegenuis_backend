import { Router } from 'express';
import PayrollRouter from './PayrollRouter';
import ExpensesRouter from './ExpensesRouter';
import SubscriptionsRouter from './SubscriptionsRouter';
import BankAccountsRouter from './BankAccountsRouter';
import AssetsRouter from './AssetsRouter';



const AccountingRouter = Router();

AccountingRouter.use('/payroll', PayrollRouter);
AccountingRouter.use('/expenses', ExpensesRouter);
AccountingRouter.use('/subscriptions', SubscriptionsRouter);
AccountingRouter.use('/bank-accounts', BankAccountsRouter);
AccountingRouter.use('/assets', AssetsRouter);


export default AccountingRouter;