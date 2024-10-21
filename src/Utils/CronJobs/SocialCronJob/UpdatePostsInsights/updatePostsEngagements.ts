import { postsInsights, fetchPosts, getInsights, TwitterPostInsights } from "../../../../Service/Operations/analytics/analytics.service";


import GroupsAnalyticsModel from "../../../../Model/Operations/analytics/analytics.model";
import { getAccount, getBrands } from "../../../../Service/Operations/BrandCreation.service";
import { ListCallAnalyticsJobsCommand } from "@aws-sdk/client-transcribe";
import SocialMediaPosts from "../../../../Model/SocialMedia/SocialMediaPosts.models";
import { resourceLimits } from "worker_threads";
const cron = require('node-cron');



/*

                sum.like_count += result?.like_count || 0
                sum.num_comments += result?.reply_count || 0
                sum.retweet_count += result?.retweet_count || 0

*/
//0 */12 * * *
const scheduleP =  cron.schedule("0 */12 * * *", async () => {
    console.log("this is update Twitter Posts cron job \n\n\n", );
    const date = new Date();

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get the last day of the month
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    
    const brands = await getBrands(0,9999999999) || []
    
    for(const brand of brands){
        console.log("this is  brand", brand)
        const posts = await fetchPosts("TWITTER",startOfMonth,endOfMonth, brand._id.toString(), false ) || []
        if (Array.isArray(posts) && posts.length) {
            console.log("this is  posts", posts)
        for (const post of posts) { 
            const result = await TwitterPostInsights(brand._id.toString() , String(post.postId))
            await SocialMediaPosts.updateOne(
                {_id:post._id},
                {$set:{likes:result?.like_count, comments:result?.reply_count, shares:result?.retweet_count }}
            )

        }
        }
    }
    
  });


export default scheduleP