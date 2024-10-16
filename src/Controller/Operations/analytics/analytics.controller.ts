import { Request, Response } from "express";
import * as analyticsService from "../../../Service/Operations/analytics/analytics.service"


export async function tmp(req:Request, res:Response) {
    try {
        const result1 = await analyticsService.TwitterPostInsights("66fcfb7157531aaf2dca2685","1845177730666533095")
        const result2 = await analyticsService.RedditPostInsights("66fcfb8c57531aaf2dca2686","t3_1g4swxx")
        //const result3 = await analyticsService.LinkedinPostInsights("66fcfb8c57531aaf2dca2686", "urn:li:share:7251141737144852480") 
        res.json({result1,result2})
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}


export async function PostsCount(req:Request, res:Response) {
    try {
        const duration = String(req.query.duration) || "Daily"
        const day = String(req.query.day) || "2024-10-15"
        const platform = String(req.query.platform) || "TWITTER"
        const limit = Number(req.query.limit) || 5
        const sign = Number(req.query.sign) || 1
        const brand = String(req.query.brand) || ""

        const result = await analyticsService.noPosts(day, duration, platform, limit, sign, brand)
        res.json({result})
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}




export async function postsInsights(req:Request, res:Response) {
    try {
        const duration = String(req.query.duration) || "Daily"
        const day = String(req.query.day) || "2024-10-15"
        const platform = String(req.query.platform) || "TWITTER"
        const brand = String(req.query.brand) || ""
        const limit = Number(req.query.limit) || 1
        const sign = Number(req.query.sign) || 1

        
        const result = await analyticsService.postsInsights(day, duration, platform, limit, sign, brand)
        res.json({result})
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}


export async function groupsInsights(req:Request, res:Response) {
    try {
        const duration = String(req.query.duration) || "Daily"
        const day = String(req.query.day) || "2024-10-15"
        const platform = String(req.query.platform) || "TWITTER"
        const group = String(req.query.group) || ""
        const limit = Number(req.query.limit) || 1
        const sign = Number(req.query.sign) || 1

        
        const result = await analyticsService.groupsInsights(day, duration, platform, limit, sign, group)
        res.json({result})
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}