import { Router, json } from "express";
import BrandCreationRouter from "./BrandCreation.router";
import BroadCastMessageRouter from "./BroadCastNotification/BroadCastMessage";
import emailCreationRouter from "./emailCreation/emailCreation.router";
import TasksRouter from "./tasks/tasks.router";
import analyticsRouter from "./analytics/analytics.router";
import yt_analyticsRouter from "./analytics/yt_analytics.router";
import engagementRouter from "./analytics/engagement.router";




const OperationRouter = Router();
//OperationRouter.use(json())
OperationRouter.use("/brand", BrandCreationRouter);
OperationRouter.use("/broadCast",BroadCastMessageRouter)
OperationRouter.use("/emails",emailCreationRouter)
OperationRouter.use("/tasks",TasksRouter)
OperationRouter.use("/analytics",analyticsRouter)
OperationRouter.use("/analytics-engagement",engagementRouter)
OperationRouter.use("/yt_analytics",yt_analyticsRouter)
//yt_analyticsRouter


export default OperationRouter;