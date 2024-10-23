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
const scheduleRP =  cron.schedule("0 */12 * * *", async () => {

  });


export default scheduleRP