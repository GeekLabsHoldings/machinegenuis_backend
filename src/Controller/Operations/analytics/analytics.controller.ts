import { Request, Response } from "express";
import * as analyticsService from "../../../Service/Operations/analytics/analytics.service"


export async function tmp(req:Request, res:Response) {
    try {
        const result = await analyticsService.LinkedinPostInsights("66fcfb8c57531aaf2dca2686","urn:li:share:7250943537427423232")
        res.json(result)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}