import Queue from "bull";
import {sendMessageToAll, CleanUp} from "../../../Service/SocialMedia/telegram.service";
import { TelegramB } from "../../../Controller/SocialMedia/socialMedia.telegram.controller";
const TelegramBot = require("node-telegram-bot-api");



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


telegramQueue.process((job) => {
  
    let { message, chatIds, file_type, file_url, captionText, delay} = job.data

    console.log("Processing job: \t", job.data);
   sendMessageToAll(
    TelegramB,
    message,
    chatIds,
    file_type,
    file_url,
    captionText,
    delay
  );
});

const telegramQueueAddJob =  (data, delay) => {

  telegramQueue.add(data,{delay:delay});
  console.log("Job added success");
};

export default telegramQueueAddJob;