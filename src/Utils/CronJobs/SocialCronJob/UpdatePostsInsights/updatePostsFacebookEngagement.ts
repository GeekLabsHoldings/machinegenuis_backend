import { postsInsights, fetchPosts, getInsights, TwitterPostInsights, FacebookPostInsights } from "../../../../Service/Operations/analytics/analytics.service";


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
const scheduleFP =  cron.schedule("0 */12 * * *", async () => {
    const brands = await getBrands(0,9999999999) || []
    for (const brand of brands){
        const result = (await FacebookPostInsights( brand._id.toString()) as {id:string|number, likes:{summary:{total_count:number}}, comments:{summary:{total_count:number}},}[])
        result.forEach(post => {
            // Sum the likes and comments for this post
            const postLikes = post.likes.summary.total_count;
            const postComments = post.comments.summary.total_count;
            SocialMediaPosts.updateOne(
                {post_id:post.id, platform:"FACEBOOK"},
                //shares:result?.retweet_count
                {$set:{likes:postLikes, comments:postComments,  }}
            )

        
            // Output the post ID, likes, and comments
            console.log(`Post ID: ${post.id}, Likes: ${postLikes}, Comments: ${postComments}`);
        });
        

    }
    
  });


export default scheduleFP