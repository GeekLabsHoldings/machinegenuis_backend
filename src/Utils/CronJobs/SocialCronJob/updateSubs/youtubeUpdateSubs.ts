import { getChannelInfo } from "../../../../Service/Operations/analytics/yt_analytics.service";
import GroupsAnalyticsModel from "../../../../Model/Operations/analytics/analytics.model";
import { getAccount } from "../../../../Service/Operations/BrandCreation.service";
import SocialMediaGroupsModel from "../../../../Model/SocialMedia/SocialMediaGroups.model";
import { Types } from "mongoose";
const cron = require('node-cron');

//0 */6 * * *

const scheduleY = cron.schedule('0 */6 * * *', async () => {
    console.log("this is youtube cron job \n\n");

      
      try {
        const groups= await SocialMediaGroupsModel.find({platform:"YOUTUBE"})
        for(const group of groups){
            const stats = await getChannelInfo(group.brand)
            group.subscribers = stats.statistics.subscriberCount
            await group.save()
            const nrecord = new GroupsAnalyticsModel({brand: group.brand,
                group_id: group.group_id,
                subs:group.subscribers,
                timestamp:Date.now(),
                platform:group.platform})
                await nrecord.save()
        }


      } catch (error) {
          console.log(error)
      }

})
    
 


export default  scheduleY