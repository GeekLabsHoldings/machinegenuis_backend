import { Request, Response } from "express";
import * as analyticsService from "../../../Service/Operations/analytics/analytics.service"


export async function tmp(req:Request, res:Response) {
    try {
        
        //const result1 = await analyticsService.LinkedinPostInsights("66fcfb8c57531aaf2dca2686", "urn:li:share:7251141737144852480") 
        const result2 = await analyticsService.FacebookPostInsights("66fcfb8c57531aaf2dca2686",)

        res.json({result2})
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
        res.json(result)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}



export async function commentsCount(req:Request, res:Response) {
    try {
        const duration = String(req.query.duration) || "Daily"
        const day = String(req.query.day) || "2024-10-15"
        const platform = String(req.query.platform) || "TWITTER"
        const limit = Number(req.query.limit) || 5
        const sign = Number(req.query.sign) || 1
        const brand = String(req.query.brand) || ""

        const result = await analyticsService.commentsCount(day, duration, platform, limit, sign, brand)
        res.json(result)
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
        res.json(result)
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
        res.json(result)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}

export async function subsGains(req:Request, res:Response) {
    try {
        const day = req.body.day
        const platform = String(req.query.platform) || "TWITTER"
        const group = String(req.query.group) || ""
        const result = await analyticsService.subsGains(day, platform, group)
        res.json(result)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}




export async function percentage(req:Request, res:Response) {
  try {
    const brand = String(req.query.brand)
    const result = await analyticsService.percentage(brand)
    res.json(result)
} catch (error) {
    res.status(500).json(error)
    console.log(error)
}
}

export async function percentageAllBrand(req:Request, res:Response) {
    try {

      const result = await analyticsService.percentageAllBrand()
      res.json(result)
  } catch (error) {
      res.status(500).json(error)
      console.log(error)
  }
  }


export async function getKPIs(req:Request, res:Response) {
    try {
        const brand = req.params.id
        const result = await analyticsService.getKPIs(brand)
        res.json(result)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}

export async function addKPIs(req:Request, res:Response) {
    try {
        const kpis = req.body.kpis
        const result = await analyticsService.addKPIs(kpis)
        res.json(result)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}


export async function updateKPIs(req:Request, res:Response) {
    try {
        const kpis = req.body.kpis

        const result = await analyticsService.updateKPIs( kpis)
        res.json(result)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
}



// export async function PostsCountChart(req:Request, res:Response) {
//     try {

//         const result = await analyticsService.noPostsChart()
//         res.json(result)
//     } catch (error) {
//         res.status(500).json(error)
//         console.log(error)
//     }
// }
