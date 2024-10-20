import { Router, } from "express";
import * as analyticsController from "../../../Controller/Operations/analytics/yt_analytics.controller"



const  yt_analyticsRouter = Router();



// kpis
yt_analyticsRouter.get("/get-data",analyticsController.getData)
yt_analyticsRouter.get("/get-channel-info",analyticsController.getChannelInfo)
yt_analyticsRouter.get("/get-authurl",analyticsController.generateAuthUrl)
yt_analyticsRouter.post("/update-access-token/",analyticsController.updateAccessTokens)


export default yt_analyticsRouter;