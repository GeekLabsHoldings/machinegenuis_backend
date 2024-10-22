import { Router, } from "express";
import * as analyticsController from "../../../Controller/Operations/analytics/analytics.controller"



const  analyticsRouter = Router();

//analytics
analyticsRouter.get("/post-count",analyticsController.PostsCount)
analyticsRouter.get("/comments-count",analyticsController.commentsCount)
analyticsRouter.get("/post-insights",analyticsController.postsInsights)
analyticsRouter.get("/group-insights",analyticsController.groupsInsights)
analyticsRouter.get("/subs-gains",analyticsController.subsGains)
analyticsRouter.get("/percentage-brands",analyticsController.percentage)
analyticsRouter.get("/percentage",analyticsController.percentageAllBrand)
//tmp
analyticsRouter.get("/tmp",analyticsController.tmp)
// analyticsRouter.get("/chart",analyticsController.PostsCountChart)


// kpis
analyticsRouter.get("/kpi/:id",analyticsController.getKPIs)
analyticsRouter.post("/kpi-add/",analyticsController.addKPIs)
analyticsRouter.post("/kpi-update/",analyticsController.updateKPIs)
export default analyticsRouter;