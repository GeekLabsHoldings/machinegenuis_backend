import { Router, json } from "express";
import BrandCreationRouter from "./BrandCreation.router";
import BroadCastMessageRouter from "./BroadCastNotification/BroadCastMessage";
import emailCreationRouter from "./emailCreation/emailCreation.router";
import TasksRouter from "./tasks/tasks.router";





const OperationRouter = Router();
//OperationRouter.use(json())
OperationRouter.use("/brand", BrandCreationRouter);
OperationRouter.use("/broadCast",BroadCastMessageRouter)
OperationRouter.use("/emails",emailCreationRouter)
OperationRouter.use("/tasks",TasksRouter)

export default OperationRouter;