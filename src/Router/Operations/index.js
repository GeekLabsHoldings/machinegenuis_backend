import { Router } from "express";
import BrandCreationRouter from "./BrandCreation.router";
import BroadCastMessageRouter from "./BroadCastNotification/BroadCastMessage";
const OperationRouter = Router();
OperationRouter.use("/brand", BrandCreationRouter);
OperationRouter.use("/broadCast",BroadCastMessageRouter)


export default OperationRouter;