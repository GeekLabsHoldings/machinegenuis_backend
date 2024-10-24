import { postsInsights, fetchPosts, getInsights, TwitterPostInsights, FacebookPostInsights } from "../../../../Service/Operations/analytics/analytics.service";


import GroupsAnalyticsModel from "../../../../Model/Operations/analytics/analytics.model";
import { getAccount, getBrands, getBrandsByPlatform } from "../../../../Service/Operations/BrandCreation.service";
import { ListCallAnalyticsJobsCommand } from "@aws-sdk/client-transcribe";
import SocialMediaPosts from "../../../../Model/SocialMedia/SocialMediaPosts.models";
import { resourceLimits } from "worker_threads";
const cron = require('node-cron');







/*

                sum.like_count += result?.like_count || 0
                sum.num_comments += result?.reply_count || 0
                sum.retweet_count += result?.retweet_count || 0

*/
//0 */12 * * *     */1 * * * *
const scheduleFP =  cron.schedule("0 */12 * * * ", async () => {
    const brands = await getBrandsByPlatform("FACEBOOK",0,9999999999) || []
    console.log("facebook post cron job brands", brands)
    for (const brand of brands){
        
        const result = (await FacebookPostInsights( brand?._id?.toString()||"") ).data
        console.log(`result in facebook cron job   \n\n`, result, result.length);
        for (const post of result){
            // Sum the likes and comments for this post
            console.log(`post in facebook cron job \n\n`, post);
            
            const postLikes = post.likes?.summary.total_count||0;
            const postComments = post.comments?.summary.total_count||0;
            const postShares = post.shares?.count||0;
            await SocialMediaPosts.updateOne(
                {postId:post.id, platform:"FACEBOOK"},
                //shares:result?.retweet_count
                {$set:{likes:postLikes, comments:postComments, shares:postShares}}
            )

        
            // Output the post ID, likes, and comments
            console.log(`Post ID: ${post.id}, Likes: ${postLikes}, Comments: ${postComments}`);
        };
        

    }
    
  });


export default scheduleFP