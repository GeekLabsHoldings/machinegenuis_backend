import { TelegramB } from "../../../../Controller/SocialMedia/socialMedia.telegram.controller";
import GroupsAnalyticsModel from "../../../../Model/Operations/analytics/analytics.model";
import { getAccount } from "../../../../Service/Operations/BrandCreation.service";
import { getChannels } from "../../../../Service/SocialMedia/telegram.service";
const cron = require('node-cron');


//0 */6 * * *
const scheduleT = cron.schedule('0 */6 * * *', async () => {
    console.log("this is telegram cron job \n\n\n");
    
    const groups = await getChannels();
    groups.forEach(async(group)=>{
      
      try {
        let acountToken = await getAccount(group.brand, "TELEGRAM");
        acountToken = acountToken?.account.token
        const tb =  new TelegramB(acountToken)
        group.subscribers = await await tb.bot.getChatMemberCount(group.group_id);
        await group.save()
        tb.cleanUp()

        const nrecord = new GroupsAnalyticsModel({brand: group.brand,
          group_id: group.group_id,
          subs:group.subscribers,
          timestamp:Date.now(),
          platform:group.platform})
          await nrecord.save()

      } catch (error) {
          console.log(error)
      }

    })
    
  });


export default  scheduleT