import mongoose, { Types } from "mongoose";
import { getAccount } from "../BrandCreation.service";
import { TelegramB } from "../../../Controller/SocialMedia/socialMedia.telegram.controller";
import { IFacebookInAccountData, ILinkedInAccountData, IRedditAccountData, ITelegramAccountData, ITwetterAccountData } from "../../../Model/Operations/IPostingAccounts_interface";
import SocialMediaPosts, { socialMediaModel } from "../../../Model/SocialMedia/SocialMediaPosts.models";
import GroupsAnalyticsModel from "../../../Model/Operations/analytics/analytics.model";
import IKPIs from "../../../Model/Operations/analytics/IKPIs.intreface";
import KPIAnalyticsModel from "../../../Model/Operations/analytics/KPIs.model";
const snoowrap = require('snoowrap');
const axios = require('axios');




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


export async function FacebookPostInsights(brand: string, postId: string) {
    try {

        const acc = await getAccount(brand, "FACEBOOK")
        const url = `https://graph.facebook.com/${postId}/posts`;

        const response = await axios.get(url, null,{
            params: {
                access_token: (acc?.account as IFacebookInAccountData).longAccessToken,
                fields: 'likes.summary(true),comments.summary(true),shares'
            }
        });
            console.log('Post Data:', response.data);
    } catch (error) {
        console.log(error)
    }
}


export async function LinkedinPostInsights(brand: string, postId: string) {
    try {

        const acc = await getAccount(brand, "LINKEDIN")
        if (acc && acc.account) {

            const account = (acc.account as ILinkedInAccountData)
            console.log(account)
            console.log("accounts  \n\n", account)
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


export async function getInsights(platform: string, posts: { brand: string, post_id: string, group_id: string }[]) {
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
    }
    return null
}


async function fetchPosts(platform:string, s:number|Date, e:number|Date, brand:string|Types.ObjectId, count:boolean=false) {
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

export async function noPosts(day: string|number|Date = Date.now(), duration: string, platform: string, limit: number, sign: number, brand:string): Promise<number[]> {
    const resultList: number[] = []

    if (duration == "Daily") {
        let date = new Date(day);
        for (let i = 0; i < limit; i++) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Start of the day
            const endOfDay = new Date(date).setHours(23, 59, 59, 999);
            const result = await fetchPosts(platform, startOfDay, endOfDay, brand, true)
            resultList.push((result as number))
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
            resultList.push((result as number))
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
            resultList.push((result as number))
            date.setDate(date.getDate() + 30 * sign);
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
                resultList.push(insights)

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
                resultList.push(insights)
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
                resultList.push(insights)
            date.setDate(date.getDate() + 30 * sign);
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

export async function groupsInsights(day: string|number|Date = Date.now(), duration: string, platform: string, limit: number, sign: number,group_id:string): Promise<number[]> {
    const resultList: number[] = []

    if (duration == "Daily") {
        let date = new Date(day);
        for (let i = 0; i < limit; i++) {
            const startOfDay = new Date(date).setHours(0, 0, 0, 0); // Start of the day
            const endOfDay = new Date(date).setHours(23, 59, 59, 999);
            const result = await fetchGroups(platform, group_id, startOfDay, endOfDay)
            if (result)
                resultList.push(result)
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
                resultList.push(result)
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
                resultList.push(result)
            else 
                resultList.push(resultList[resultList.length-1])
            date.setDate(date.getDate() + 30 * sign);
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
          ]
        }
      },
      {
        $project: {
          daily: { $arrayElemAt: ["$daily", 0] },
          weekly: { $arrayElemAt: ["$weekly", 0] },
          monthly: { $arrayElemAt: ["$monthly", 0] }
        }
      }
    ]);
  
    return result[0];

}







export async function getKPIs(brand:string) {
    try {
        const kpis =await KPIAnalyticsModel.find({brand:brand})
        const achievedKPIs:{platform:string, postsPerDay: number, postsPerWeek: number, postsPerMonth: number }[] = []
        for(const k of kpis){
            const achievedD = await noPosts(Date.now(), "Daily", k.platform, 1, 1 , brand)
            const achievedW = await noPosts(Date.now(), "Weekly", k.platform, 1, 1 , brand) 
            const achievedM = await noPosts(Date.now(), "Monthly", k.platform, 1, 1 , brand)
            achievedKPIs.push({platform:k.platform,  postsPerDay: achievedD[0], postsPerWeek: achievedW[0], postsPerMonth: achievedM[0] })
        }
        
        return {kpis,achievedKPIs}
    } catch (error) {
        console.log(error)
    }
}

export async function addKPIs(kpis:IKPIs[]) {
    const newKpis = kpis.map(kpiData => new KPIAnalyticsModel(kpiData));
    
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