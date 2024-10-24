import { Request, Response } from "express";
import * as engagementService from "../../../Service/Operations/analytics/engagement.service";
import { GetSubCount } from "../../../Service/SocialMedia/setting.service";

export async function getEngagement(req:Request, res:Response){
   try {
    const brand = String(req.query.brand)

    const subs = (await GetSubCount() as {brand:string, platforms:{}}[])
    const brandObject = (subs.find(sub => sub.brand === brand.toString()) as {brand:string, platforms:{TWITTER:{totalSubscribers:number}}});
    //  console.log("brandObject,,,,, \n\n",brand, brandObject, subs)
    let sum = 1

    if(brandObject){
      const tmp = brandObject.platforms.TWITTER.totalSubscribers ;
      sum = tmp?tmp:sum
   }
    const te = await engagementService.getTwitterEngagement(sum, brand)
    return res.json({twitter:te})
   } catch (error) {
    console.log(error);
   }
}  


export async function getAllEngagement(req:Request, res:Response){
   try {
    const brand = String(req.query.brand)

    const subs = (await GetSubCount() as {brand:string, platforms:{}}[])
    const brandObject = (subs.find(sub => sub.brand === brand.toString()) as {brand:string, platforms:{TWITTER:{totalSubscribers:number}}});
    //  console.log("brandObject,,,,, \n\n",brand, brandObject, subs)
    let sum = 1

    if(brandObject){
      const tmp = brandObject.platforms.TWITTER.totalSubscribers ;
      sum = tmp?tmp:sum
   }
    const te = await engagementService.getTwitterEngagement(sum, brand)
    return res.json({twitter:te})
   } catch (error) {
    console.log(error);
   }
}