import { Router, } from "express";
import * as analyticsController from "../../../Controller/Operations/analytics/analytics.controller"



const  analyticsRouter = Router();
analyticsRouter.get("/tmp",analyticsController.tmp)


export default analyticsRouter;