



import GroupsAnalyticsModel from "../../../../Model/Operations/analytics/analytics.model";
import { getAccount } from "../../../../Service/Operations/BrandCreation.service";
import * as RedditServices from "../../../../Service/SocialMedia/reddit.Service";
const cron = require('node-cron');



const scheduleR =  cron.schedule("0 */6 * * *", async () => {
    console.log("this is REDDIT cron job \n\n\n", );
    const groups = await RedditServices.getSubreddits();

    groups.forEach(async (group) => {
      try {
        const acount = await getAccount(group.brand,"REDDIT");
        const account = acount?.account
        console.log("this is REDDIT ACCOUNT \n\n\n", account);
        const r = await RedditServices.getsnoowrap(
          account.appID,
          account.appSecret,
          account.username,
          account.password
        );
        group.subscribers = await RedditServices.getSubredditSubs(r,group.group_name)||2;
        await group.save();

        const nrecord = new GroupsAnalyticsModel({brand: group.brand,
          group_id: group.group_id,
          subs:group.subscribers,
          timestamp:Date.now(),
          platform:group.platform})
          await nrecord.save()
      } catch (error) {
        console.log(error)
      }
     
    });
  });


export default scheduleR