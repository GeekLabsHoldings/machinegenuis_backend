import { Router } from "express";
import EmailCustomerServiceRouter from "./EmailsRouter";
const CustomerServiceRouter = Router();

CustomerServiceRouter.use('/email', EmailCustomerServiceRouter);

export default CustomerServiceRouter;