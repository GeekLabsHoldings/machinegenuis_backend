import { Request, Response } from "express";
import * as engagementService from "../../../Service/Operations/analytics/engagement.service";

export async function getEngagement(req:Request, res:Response){
   try {
    const brand = String(req.query.brand)
    const te = await engagementService.getTwitterEngagement(1000, brand)
    return res.json({twitter:te})
   } catch (error) {
    console.log(error);
   }
}