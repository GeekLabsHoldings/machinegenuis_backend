import { Router, } from "express";
import * as analyticsController from "../../../Controller/Operations/analytics/analytics.controller"



const  analyticsRouter = Router();
analyticsRouter.get("/post-count",analyticsController.PostsCount)
analyticsRouter.get("/post-insights",analyticsController.postsInsights)
analyticsRouter.get("/group-insights",analyticsController.groupsInsights)
analyticsRouter.get("/tmp",analyticsController.tmp)

export default analyticsRouter;