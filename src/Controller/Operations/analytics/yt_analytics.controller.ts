import { Request, Response } from "express";
import systemError from "../../../Utils/Error/SystemError";
import * as yt_analyticsService from "../../../Service/Operations/analytics/yt_analytics.service"

export async function getData(req:Request, res:Response) {
   try {
        const brand = String(req.query.brand)
        const startDate = String(req.query.startDate)
        const endDate = String(req.query.endDate)
        const dimensions = String(req.query.dimensions)
        const data = await yt_analyticsService.getData(brand, startDate, endDate, dimensions)
        res.json({data})
   } catch (error) {
    console.log(error);
    return systemError.sendError(res, error);
   } 
}

export async function getChannelInfo(req:Request, res:Response) {
    try {
        const brand = String(req.query.brand)
        const data = await yt_analyticsService.getChannelInfo(brand)
        res.json({data})
    } catch (error) {
     console.log(error);
     return systemError.sendError(res, error);
    }  
}

export async function updateAccessTokens(req:Request, res:Response) {
    try {
        const brand = req.body.brand
        const token = req.body.token
        const data = await yt_analyticsService.updateAccessTokens(brand,token)
        res.json({data})
    } catch (error) {
     console.log(error);
     return systemError.sendError(res, error);
    } 
}



export async function generateAuthUrl(req:Request, res:Response) {
    try {
        const brand = String(req.query.brand)
        const authUrl = await yt_analyticsService.generateAuthUrl(brand)
        res.json({authUrl})
    } catch (error) {
     console.log(error);
     return systemError.sendError(res, error);
    } 
}
//updateAccessTokens   generateAuthUrl