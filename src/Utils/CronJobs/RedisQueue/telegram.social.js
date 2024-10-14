import Queue from "bull";
import {sendMessageToAll, CleanUp} from "../../../Service/SocialMedia/telegram.service";
import { TelegramB } from "../../../Controller/SocialMedia/socialMedia.telegram.controller";
const TelegramBot = require("node-telegram-bot-api");
import SocialMediaCampaigns from "../../../Model/SocialMedia/campaign.socialmedia.model";
import { log } from "console";


function delay_(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

const redisOptions = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASS,
};


// Create a queue with a name (e.g., 'my-queue')
const telegramQueue = new Queue("telegram-social-queue1",  { redis: redisOptions });
telegramQueue.on('error', (err) => {
  console.log('Redis error:', err);
});


  telegramQueue.process( (job) => {
    
      let { message, chatIds, file_type, file_url, captionText, delay, campaign} = job.data

      console.log("Processing job: \t");
      try {
        SocialMediaCampaigns.findOneAndUpdate(
          { _id: campaign._id },
          { $set: { status: 'Running' } }
        ).then(() => {
          return sendMessageToAll(TelegramB, message, chatIds, file_type, file_url, captionText, delay);
        }).then(() => {
          return SocialMediaCampaigns.updateOne(
            { _id: campaign._id },
            { $set: { status: 'Finished', posts_shared: chatIds.length } }
          );
        }).catch((error) => {
          console.log(error);
          return SocialMediaCampaigns.updateOne(
            { _id: campaign._id },
            { $set: { status: 'Failed' } }
          );
        });
      } catch (error) {
        console.log(error)
      }
  
  });

const telegramQueueAddJob = async (data, delay) => {
  const newcampaign = SocialMediaCampaigns({content:data.message, timestamp:Date.now(), 
    platform:"TELEGRAM", engagment:0, posts_shared:0, brand:data.brand, status:"Pending"})
  const campaign = await newcampaign.save()
  data = {...data, campaign: campaign}
  telegramQueue.add(data,{delay:delay});
  console.log("Job added success");
};

export default telegramQueueAddJob;