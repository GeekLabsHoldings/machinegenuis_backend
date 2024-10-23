import mongoose, { Types } from "mongoose";
import { getAccount, getBrandById, getBrands } from "../BrandCreation.service";
import { TelegramB } from "../../../Controller/SocialMedia/socialMedia.telegram.controller";
import { IFacebookInAccountData, ILinkedInAccountData, IRedditAccountData, ITelegramAccountData, ITwetterAccountData, IYoutubeAccountData } from "../../../Model/Operations/IPostingAccounts_interface";
import SocialMediaPosts, { socialMediaModel } from "../../../Model/SocialMedia/SocialMediaPosts.models";
import GroupsAnalyticsModel from "../../../Model/Operations/analytics/analytics.model";
import IKPIs from "../../../Model/Operations/analytics/IKPIs.intreface";
import KPIAnalyticsModel from "../../../Model/Operations/analytics/KPIs.model";
const snoowrap = require('snoowrap');
const axios = require('axios');
import socialCommentModel from "../../../Model/SocialMedia/Twitter.SocialMedia.tweets.model";
import YouTubeAnalytics from "../../SocialMedia/youtube.services";
import { GetSubCount, GetSubCount_brand } from "../../SocialMedia/setting.service";
import { getGroupsByBrand } from "../../SocialMedia/setting.service";
import { startOfMonth, endOfMonth } from 'date-fns';
import { getPageAccessToken } from "../../SocialMedia/facebook.service";

export async function TwitterPostInsights(brand: string, postId: string) {
    try {


        const acc = await getAccount(brand, "TWITTER")
        if (acc && acc.account) {
            const account = (acc.account as ITwetterAccountData)
            // Your Twitter API credentials
            const url = `https://api.twitter.com/2/tweets/${postId}?tweet.fields=public_metrics`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${account.BearerToken}`,
                }
            });
            
            const metrics = response.data.data.public_metrics;

            //console.log(`Quotes: ${metrics.quote_count}`);
            // Note: public metrics and other expanded data won't be available here
            return { like_count: Number(metrics.like_count), reply_count: Number(metrics.reply_count), 
                retweet_count: Number(metrics.retweet_count), quote_count:Number(metrics.quote_count) }
        }
        return null
    } catch (error) {
        console.log(error)
    }
}









export async function RedditPostInsights(brand: string, postId: string) {
    try {

        const acc = await getAccount(brand, "REDDIT")
        if (acc && acc.account) {
            const account = (acc.account as IRedditAccountData)
            const r = new snoowrap({
                userAgent: 'geekapp/v1.1.01',
                clientId: account.appID,
                clientSecret: account.appSecret,
                username: account.username,
                password: account.password
            });

            const submission = await r.getSubmission(postId).fetch();



            return {
                ups: Number(submission.ups), downs: Number(submission.downs), upvote_ratio: Number(submission.upvote_ratio),
                num_comments: Number(submission.num_comments), score: Number(submission.score)
            };
        }
        return null
    } catch (error) {
        console.log(error)
    }
}


export async function TelegramPostInsights(brand: string, chatId: string, postId: string) {
    try {


        const acc = await getAccount(brand, "TELEGRAM")
        if (acc && acc.account) {

            const tb = new TelegramB((acc.account as ITelegramAccountData).token);

            const message = await tb.bot.getChat(chatId);
            console.log(`Channel Name: ${message.title}`);
            console.log(`Channel Username: ${message.username}`);

            const messageInfo = await tb.bot.forwardMessage(chatId, chatId, postId);
            console.log(`Message ID: ${messageInfo.message_id}`);
            console.log(`Message Text: ${messageInfo.text}`);
            console.log(`Views: ${messageInfo.views}`);

            // Delete the forwarded message
            await tb.bot.deleteMessage(chatId, messageInfo.message_id);
            await tb.cleanUp()
            return messageInfo
        }
        return null

    } catch (error) {
        console.log(error)
    }
}

//https://graph.facebook.com/449650021555087/posts?access_token=&fields=likes.summary(true),comments.summary(true),shares
export async function FacebookPostInsights(brand: string) {
    try {

        const acc = await getAccount(brand, "FACEBOOK")
        const axios = require('axios');
        
        const account = (acc?.account as IFacebookInAccountData)
        const accessToken =  await getPageAccessToken(account.pageID, account.longAccessToken)


        console.log("this is facebook generated access tokens\n\n", accessToken.access_token,accessToken.id, account.pageID)
        const url = `https://graph.facebook.com/${account.pageID}/posts`;
        const params = {
            access_token: accessToken.access_token,
            fields: 'likes.summary(true),comments.summary(true),shares'
        };
        const  response = await axios.get(url, { params })
        return response.data
    } catch (error) {
        console.log(error)
    }
}


export async function LinkedinPostInsights(brand: string, postId: string) {
    try {

        const acc = await getAccount(brand, "LINKEDIN")
        if (acc && acc.account) {

            const account = (acc.account as ILinkedInAccountData)

            const response = await axios.get(
                `https://api.linkedin.com/v2/socialActions/${postId}`,
                {
                    headers: {
                        Authorization: `Bearer ${account.token}`,
                    },
                }
            );
            console.log(response.data)
            return response.data;
        }
        return null
    } catch (error) {
        console.log(error)
    }
}


export async function getInsights(platform: string, posts: { brand: string; post_id: string; group_id: string; }[]) {
    const sum = { like_count: 0, num_comments: 0, retweet_count: 0}
    if (platform == "TWITTER") {
        
        const length = posts.length 
        for (const post of posts) { 
            const result = await TwitterPostInsights(post.brand, post.post_id)
            sum.like_count += result?.like_count || 0
            sum.num_comments += result?.reply_count || 0
            sum.retweet_count += result?.retweet_count || 0
        }
        if(length){
            sum.like_count /= length
            sum.num_comments /= length
            sum.retweet_count /= length
        }

        return sum
    } else if (platform == "REDDIT") {

        const length = posts.length
        for (const post of posts) {
            const result = await RedditPostInsights(post.brand, post.post_id)
            sum.like_count += result?.ups || 0
            sum.num_comments += result?.num_comments || 0
            sum.retweet_count += result?.score || 0
        }
        if(length){
            sum.like_count /= length
            sum.num_comments /= length
            sum.retweet_count /= length
        }
        
        return sum
    }else if (platform == "FACEBOOK") {

        const length = posts.length
        for (const post of posts) {
            const result = await RedditPostInsights(post.brand, post.post_id)
            sum.like_count += result?.ups || 0
            sum.num_comments += result?.num_comments || 0
            sum.retweet_count += result?.score || 0
        }
        if(length){
            sum.like_count /= length
            sum.num_comments /= length
            sum.retweet_count /= length
        }
    }
    return null
}


export async function fetchPosts(platform:string, s:number|Date, e:number|Date, brand:string|Types.ObjectId, count:boolean=false) {
    if (count){
        return await SocialMediaPosts.countDocuments({
            timestamp: {
                $gte: s,
                $lte: e
            },
            platform: platform,
           $or:[{brandId: { $in: [brand, new Types.ObjectId(brand)] }},{brand:brand}]
           
        });
    }else{
        return await SocialMediaPosts.find({
            timestamp: {
                $gte: s,
                $lte: e
            },
            platform: platform,
           $or:[{brandId: { $in: [brand, new Types.ObjectId(brand)] }},{brand:brand}]
           
        });
    }
    
   
}

export async function noPosts(day: string|number|Date = Date.now(), duration: string, platform: string, limit: number, sign: number, brand:string): Promise<{date:number|Date, data:number}[]> {
    const resultList: {date:number|Date, data:number}[] = []

    if (duration == "Daily") {
        let date = new Date(day);
        for (let i = 0; i < limit; i++) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Start of the day
            const endOfDay = new Date(date).setHours(23, 59, 59, 999);
            const result = await fetchPosts(platform, startOfDay, endOfDay, brand, true)
            //console.log(result)
            resultList.push({date: startOfDay, data: (result as number)})
            date.setDate(date.getDate() + 1 * sign);
        }

    } else if (duration == "Weekly") {
        const date = new Date(day);

        for (let i = 0; i < limit; i++) {
            // Get the start of the week (Monday)
            const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 1));
            startOfWeek.setHours(0, 0, 0, 0);

            // Get the end of the week (Sunday)
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            const result = await fetchPosts(platform, startOfWeek, endOfWeek, brand, true)
            resultList.push({date: startOfWeek, data: (result as number)})
            date.setDate(date.getDate() + 7 * sign);
        }


    } else if (duration == "Monthly") {
        const date = new Date(day);

        for (let i = 0; i < limit; i++) {
            // Get the first day of the month
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);

            // Get the last day of the month
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);
            const result = await fetchPosts(platform, startOfMonth, endOfMonth, brand, true)
            resultList.push({date: startOfMonth, data: (result as number)})
            date.setDate(date.getDate() + 30 * sign);
        }

       
    }else if (duration == "Yearly") {
        const date = new Date(day);

        for (let i = 0; i < limit; i++) {
            // Get the first day of the month
            const startOfYear = new Date(date.getFullYear(), 1, 1);
            startOfYear.setHours(0, 0, 0, 0);
    
            // Get the last day of the year
            const endOfYear = new Date(date.getFullYear(), 0, 31);
            endOfYear.setHours(23, 59, 59, 999);
            const result = await fetchPosts(platform, startOfYear, endOfYear, brand, true)
            resultList.push({date: startOfYear, data: (result as number)})
            date.setFullYear(date.getFullYear() + sign);
        }
    }
    return sign==-1?resultList.reverse():resultList;
}





export async function postsInsights(day: string|number|Date = Date.now(), duration: string, platform: string, limit: number, sign: number, brand: string | Types.ObjectId): Promise<object[]> {
    const resultList: object[] = []

    if (duration == "Daily") {
        let date = new Date(day);
        for (let i = 0; i < limit; i++) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Start of the day
            const endOfDay = new Date(date).setHours(23, 59, 59, 999);
            const result =  await fetchPosts(platform, startOfDay, endOfDay, brand)
            const insights = await getInsights(platform, result as { brand: string, post_id: string, group_id: string }[])
            if(insights)
                resultList.push({date:startOfDay,data:insights})

            date.setDate(date.getDate() + 1 * sign);
        }

    } else if (duration == "Weekly") {
        const date = new Date(day);

        for (let i = 0; i < limit; i++) {
            // Get the start of the week (Monday)
            const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 1));
            startOfWeek.setHours(0, 0, 0, 0);

            // Get the end of the week (Sunday)
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            const postCount = await fetchPosts(platform, startOfWeek, endOfWeek, brand)
            const insights = await getInsights(platform, postCount as { brand: string, post_id: string, group_id: string }[])
            if(insights)
                resultList.push({date:startOfWeek,data:insights})
            date.setDate(date.getDate() + 7 * sign);
        }


    } else if (duration == "Monthly") {
        const date = new Date(day);

        for (let i = 0; i < limit; i++) {
            // Get the first day of the month
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);

            // Get the last day of the month
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);
            const postCount = await fetchPosts(platform, startOfMonth, endOfMonth, brand)
            const insights = await getInsights(platform, postCount as { brand: string, post_id: string, group_id: string }[])
            if(insights)
                resultList.push({date:startOfMonth,data:insights})
            date.setDate(date.getDate() + 30 * sign);
        }

        
    }else if (duration == "Yearly") {
        const date = new Date(day);

        for (let i = 0; i < limit; i++) {
            // Get the first day of the month
            const startOfYear = new Date(date.getFullYear(), 0, 1);
            startOfYear.setHours(0, 0, 0, 0);
    
            // Get the last day of the year
            const endOfYear = new Date(date.getFullYear(), 11, 31);
            endOfYear.setHours(23, 59, 59, 999);
            const postCount = await fetchPosts(platform, startOfYear, endOfYear, brand)
            const insights = await getInsights(platform, postCount as { brand: string, post_id: string, group_id: string }[])
            if(insights)
                resultList.push({date:startOfYear,data:insights})
            date.setFullYear(date.getFullYear() + sign);
        }
    }
    return sign==-1?resultList.reverse():resultList;
}


async function fetchGroups(platform:string, group_id:string, s:Date|number|Number, e:Date|number|Number) {
    const result = await GroupsAnalyticsModel.findOne({
        timestamp: {
            $gte: s,
            $lte: e
        },
        platform: platform,
        group_id:group_id
    }). sort({subs:-1});

    return (result?.subs as number)
}

export async function groupsInsights(day: string|number|Date = Date.now(), duration: string, platform: string, limit: number, sign: number,group_id:string): Promise<object[]> {
    const resultList: object[] = []

    if (duration == "Daily") {
        let date = new Date(day);
        for (let i = 0; i < limit; i++) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Start of the day
            const endOfDay = new Date(date).setHours(23, 59, 59, 999);
            const result = await fetchGroups(platform, group_id, startOfDay, endOfDay)
            if (result)
                resultList.push({date: startOfDay, result: result})
            else if (resultList.length)
                resultList.push(resultList[resultList.length-1])
            date.setDate(date.getDate() + 1 * sign);
        }

    } else if (duration == "Weekly") {
        const date = new Date(day);

        for (let i = 0; i < limit; i++) {
            // Get the start of the week (Monday)
            const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 1));
            startOfWeek.setHours(0, 0, 0, 0);

            // Get the end of the week (Sunday)
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            const result = await fetchGroups(platform, group_id, startOfWeek, endOfWeek)
            if (result)
                resultList.push({date: startOfWeek, result: result})
            else 
                resultList.push(resultList[resultList.length-1])
            date.setDate(date.getDate() + 7 * sign);
        }


    } else if (duration == "Monthly") {
        const date = new Date(day);

        for (let i = 0; i < limit; i++) {
            // Get the first day of the month
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);

            // Get the last day of the month
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);
            const result = await fetchGroups(platform, group_id, startOfMonth, endOfMonth)
            if (result)
                resultList.push({date: startOfMonth, result: result})
            else 
                resultList.push(resultList[resultList.length-1])
            date.setDate(date.getDate() + 30 * sign);
        }

        
    }else if (duration == "Yearly") {
        const date = new Date(day);

        for (let i = 0; i < limit; i++) {
            // Get the first day of the month
            const startOfYear = new Date(date.getFullYear(), 0, 1);
            startOfYear.setHours(0, 0, 0, 0);
    
            // Get the last day of the year
            const endOfYear = new Date(date.getFullYear(), 11, 31);
            endOfYear.setHours(23, 59, 59, 999);
            const result = await fetchGroups(platform, group_id, startOfYear, endOfYear)
            if (result)
                resultList.push({date: startOfYear, result: result})
            else 
                resultList.push(resultList[resultList.length-1])
            date.setFullYear(date.getFullYear() + sign);
        }
    }
    return sign==-1?resultList.reverse():resultList;
}





export async function subsGains(endDate:string|number|Date = Date.now(), platform:string, group_id:string) {
    endDate = new Date(endDate)
    const startOfDay = new Date(endDate);
    startOfDay.setHours(0, 0, 0, 0);
  
    const startOfWeek = new Date(endDate);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);
  
    const startOfMonth = new Date(endDate);
    startOfMonth.setMonth(startOfMonth.getMonth() - 1);
    startOfMonth.setHours(0, 0, 0, 0);
  
    const startOfYear = new Date(endDate.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);

    const result = await GroupsAnalyticsModel.aggregate([
      {
        $match: {
          group_id: group_id,
          platform:platform,
          timestamp: { $lte: endDate.getTime() }
        }
      },
      {
        $facet: {
          daily: [
            { $match: { timestamp: { $gte: startOfDay.getTime() } } },
            { $sort: { timestamp: 1 } },
            { $group: {
                _id: null,
                startSubs: { $first: "$subs" },
                endSubs: { $last: "$subs" }
            } },
            { $project: {
                _id: 0,
                gain: { $subtract: ["$endSubs", "$startSubs"] }
            } }
          ],
          weekly: [
            { $match: { timestamp: { $gte: startOfWeek.getTime() } } },
            { $sort: { timestamp: 1 } },
            { $group: {
                _id: null,
                startSubs: { $first: "$subs" },
                endSubs: { $last: "$subs" }
            } },
            { $project: {
                _id: 0,
                gain: { $subtract: ["$endSubs", "$startSubs"] }
            } }
          ],
          monthly: [
            { $match: { timestamp: { $gte: startOfMonth.getTime() } } },
            { $sort: { timestamp: 1 } },
            { $group: {
                _id: null,
                startSubs: { $first: "$subs" },
                endSubs: { $last: "$subs" }
            } },
            { $project: {
                _id: 0,
                gain: { $subtract: ["$endSubs", "$startSubs"] }
            } }
          ],
          yearly: [
            { $match: { timestamp: { $gte: startOfYear.getTime() } } },
            { $sort: { timestamp: 1 } },
            { $group: {
                _id: null,
                startSubs: { $first: "$subs" },
                endSubs: { $last: "$subs" }
            } },
            { $project: {
                _id: 0,
                gain: { $subtract: ["$endSubs", "$startSubs"] }
            } }
          ]
        }
      },
      {
        $project: {
          daily: { $arrayElemAt: ["$daily", 0] },
          weekly: { $arrayElemAt: ["$weekly", 0] },
          monthly: { $arrayElemAt: ["$monthly", 0] },
          yearly: { $arrayElemAt: ["$yearly", 0] }
        }
      }
    ]);
    return result
}






export async function percentage(brand:string) {

    const subs = (await GetSubCount() as {brand:string, platforms:{}}[])
    const brandObject = subs.find(sub => sub.brand === brand.toString());
    //  console.log("brandObject,,,,, \n\n",brand, brandObject, subs)
    let sum = 0
    const gain = {daily:0,weekly:0,monthly:0}
    if(brandObject){
    const platforms = brandObject.platforms as { [key: string]: { totalSubscribers: number } };

    // Iterate over platforms object and sum up totalSubscribers
    for (const platform of Object.values(platforms)) {
        sum += platform.totalSubscribers;
    }
    
    
    type GainResponse = {
        daily: {
            gain: number;
        };
        weekly: {
            gain: number;
        };
        monthly: {
            gain: number;
        };
    };
    const groups = (await getGroupsByBrand(brand, 0, 99999))?.groups || []
    
    for (const g of groups){
        const result = (await subsGains( Date.now(), g.platform, g.group_id))[0] as GainResponse
        console.log("this is percentage  \n\n",sum, gain, result)
        gain.daily += result.daily ? result.daily.gain:0
        gain.weekly += result.weekly ? result.weekly.gain:0
        gain.monthly += result.monthly ? result.monthly.gain:0
    }
    gain.daily =  (gain.daily /sum) * 100
    gain.weekly = (gain.weekly/sum) * 100 
    gain.monthly = (gain.monthly/sum) * 100
}
    //console.log("this is percentage  \n\n", {followers:sum, percentages:gain})
    return  {followers:sum, percentages:gain}

}


export async function percentageAllBrand() {

    const brands = await getBrands(0,99999)||[]
    
    const data = []
    for(const brand of brands){
        const p = await percentage(brand._id)
        data.push({brand:brand._id,...p })
    }

    //console.log("this is percentage  \n\n", {followers:sum, percentages:gain})
    return  data

}

export async function getKPIs(brand:string) {
    try {
        const kpis :{_id:object, platforms:IKPIs[]}[] = await KPIAnalyticsModel.aggregate([
            // Match the documents with the specified brand name
            {
              $match: { brand: brand }
            },
            // Project the month and year from the timeStamp field
            {
              $project: {
                year: { 
                  $year: { 
                    $toDate: "$timeStamp"  // Directly convert as it's in milliseconds
                  } 
                },
                month: { 
                  $month: { 
                    $toDate: "$timeStamp" 
                  } 
                },
                brand: 1,
                timeStamp: 1,
                platform: 1,
                postsPerDay: 1,
                postsPerWeek: 1,
                postsPerMonth: 1 // Include any other fields you may want to keep
              }
            },
            // Group by year and month
            {
              $group: {
                _id: {
                  year: "$year",
                  month: "$month",
                  brand: "$brand"
                },
                platforms: { $push: "$$ROOT" }
              }
            },
            // Optionally sort by the year and month
            {
              $sort: { "_id.year": 1, "_id.month": 1 }
            }
          ]);
         // log("this is the kpis   \n", kpis)

        //  const acc = await getAccount(brand,"YOUTUBE")
        //  const account = (acc?.account as IYoutubeAccountData)
        //  console.log("this is ", account, brand)
        //  const analytics = new YouTubeAnalytics(account);
 
        const achievedKPIs:any[] = []
        for(const k of kpis){
            const ak :any[]= []
            for(const kpi of k.platforms){

                const achievedD = await noPosts(kpi.timeStamp||Date.now(), "Daily", kpi.platform, 1, 1 , brand)
                const achievedW = await noPosts(kpi.timeStamp||Date.now(), "Weekly", kpi.platform, 1, 1 , brand) 
                const achievedM = await noPosts(kpi.timeStamp||Date.now(), "Monthly", kpi.platform, 1, 1 , brand)
                ak.push({platform:kpi.platform, Day:achievedD[0].data, Week:achievedW[0].data, Month:achievedM[0].data})
            }

            achievedKPIs.push({_id:k._id,  platforms:ak })
        }
        
        return {kpis,achievedKPIs}
    } catch (error) {
        console.log(error)
    }
}

export async function addKPIs(kpis:IKPIs[]) {
    const newKpis:IKPIs[] = []
    
    for(const kpiData of kpis){
        
            const date = new Date(kpiData.timeStamp);
    
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);

            // Get the last day of the month
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);
          
    
            const kpi = await KPIAnalyticsModel.find({
                brand:kpiData.brand,
                platform:kpiData.platform,
              timeStamp: {
                $gte: startOfMonth,  // Greater than or equal to the start of the month
                $lte: endOfMonth,     // Less than the end of the month
              },
            });
            if(!kpi || kpi.length == 0)
                newKpis.push(new KPIAnalyticsModel(kpiData))
    }

    
    // Save all new KPI documents
    const savedKpis = await KPIAnalyticsModel.insertMany(newKpis);
 
    return savedKpis; 
}


export async function updateKPIs(kpis:IKPIs) {
    try {

        const updated = await KPIAnalyticsModel.updateOne(
            { brand: kpis.brand, platform: kpis.platform },
            { ...kpis },// Options to return the updated document
        );

        if (!updated) {
            console.log(`No KPI data found for brand: ${kpis.brand} and platform: ${kpis.platform}`);
            return null; // Or throw an error based on your needs
        }

        return updated;
    } catch (error) {
        console.log(error)
    }
}


async function fetchComments(platform: string, brand: string, s: Date | number , e: Date | number ) {
    const startDate = new Date(s).toISOString();
    const endDate = new Date(e).toISOString();

    const result = await socialCommentModel.countDocuments({
        createdAt: {
            $gte: startDate,
            $lte: endDate
        },
        platform: platform,
        brand: brand
    });

    return result as number;
}

export async function commentsCount(day: string | number | Date = Date.now(), duration: string, platform: string, limit: number, sign: number, brand: string): Promise<object[]> {
    const resultList: object[] = [];
    let date = new Date(day);

    if (duration == "Daily") {
       
        for (let i = 0; i < limit; i++) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0);
            const endOfDay = new Date(date).setHours(23, 59, 59, 999);
            const result = await fetchComments(platform, brand, startOfDay, endOfDay);

            resultList.push({ day: startOfDay, data: result });
   
            date.setDate(date.getDate() + 1 * sign);
        }
    } else if (duration == "Weekly") {
        for (let i = 0; i < limit; i++) {
            const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 1));
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            const result = await fetchComments(platform, brand, startOfWeek, endOfWeek);

            resultList.push({ day: startOfWeek, data: result });

            date.setDate(date.getDate() + 7 * sign);
        }
    } else if (duration == "Monthly") {
 
        for (let i = 0; i < limit; i++) {
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            startOfMonth.setHours(0, 0, 0, 0);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);
            const result = await fetchComments(platform, brand, startOfMonth, endOfMonth);

            resultList.push({ day: startOfMonth, data: result });

            date.setDate(date.getDate() + 30 * sign);
        }
    }else if (duration == "Yearly") {
        const date = new Date(day);

        for (let i = 0; i < limit; i++) {
            // Get the first day of the month
            const startOfYear = new Date(date.getFullYear(), 0, 1);
            startOfYear.setHours(0, 0, 0, 0);
    
            // Get the last day of the year
            const endOfYear = new Date(date.getFullYear(), 11, 31);
            endOfYear.setHours(23, 59, 59, 999);
            
            const result = await fetchComments(platform, brand, startOfYear, endOfYear);
            resultList.push({ day: startOfYear, data: result });

            date.setFullYear(date.getFullYear() + sign);
        }
    }
    return sign == -1 ? resultList.reverse() : resultList;
}
