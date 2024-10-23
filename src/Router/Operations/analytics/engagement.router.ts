import { Router, } from "express";
import * as engagementController from "../../../Controller/Operations/analytics/engagement.controller"



const  engagementRouter = Router();



// kpis
engagementRouter.get("/get-engagement",engagementController.getEngagement)



export default engagementRouter;