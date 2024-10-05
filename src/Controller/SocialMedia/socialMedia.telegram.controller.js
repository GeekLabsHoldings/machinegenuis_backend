const TelegramBot = require("node-telegram-bot-api");
import {
  AddTelegramChannel,
  getChannels,
  AddTelegramMessage,
  getChannelsByBrand,
  DeleteTelegramMessage,
  GetSubCount,
  CleanUp,
  sendMessageToAll,
} from "../../Service/SocialMedia/telegram.service";
import systemError from "../../Utils/Error/SystemError";
const crypto = require('crypto');
const cron = require('node-cron');
import telegramQueueAddJob from "../../Utils/CronJobs/RedisQueue/telegram.social";
import { getAccount } from "../../Service/Operations/BrandCreation.service";

export class TelegramB { 
  constructor(token){
    if(!token)
      token = process.env.TELEGRAMBOT_ACCESS_TOKEN
    this.token = token
   // console.log("token: " + token);
    this.bot= new TelegramBot(this.token, {
      polling: true,
    });
    
    this.bot.on('polling_error', () => {
      // Do nothing, prevent logging
    });
  }
  async cleanUp(){
    await CleanUp(this.token)
  }
    
}





export async function add_channel(req, res) {
  try {
    const { group_name, link, group_id, niche, brand, platform, engagement } =
      req.body;

    let acountToken = await getAccount(brand, "TELEGRAM");
    acountToken = acountToken.token
    const tb =  new TelegramB(acountToken)
    const subscribers = await tb.bot.getChatMemberCount(group_id);
    tb.cleanUp()
    const newGroup = await AddTelegramChannel(
      group_name,
      link,
      group_id,
      subscribers,
      niche,
      brand,
      platform,
      engagement
    );

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup); // Respond with the saved group
  } catch (error) {
    console.error("Error adding group:", error);
    return systemError.sendError(res, error);
  }
}

export async function get_channels(req, res) {
  try {
    const groups = await getChannels();
    res.status(200).json({ channels: groups }); // Respond with all the groups
  } catch (error) {
    console.error("Error fetching groups:", error);
    return systemError.sendError(res, error);
  }
}


export async function get_channels_brand(req, res) {
  try {
    const channels = await getChannelsByBrand(req.params.id);
    res.json(channels);
  } catch (error) {
    return systemError.sendError(res, error);
  }
}





export async function campaign(req, res) {
  try {
    const chatIds = await getChannels();
    const message = req.body.message;
    const file_url = req.body.file_url;
    const captionText = req.body.captionText;
    const file_type = req.body.file_type;
    let delay = req.body.delay;
    let starttime = req.body.starttime;

    starttime = starttime - Date.now();
    
    if (starttime<=0)
        starttime = 10000

    
    telegramQueueAddJob({ message, chatIds, file_type, file_url, captionText, delay}, starttime)

    res.json({
      message: message,
      file: file_url,
      captionText: captionText,
      chatIds: chatIds,
    });
  } catch (error) {
    console.log(error);
    return systemError.sendError(res, error);
  }
}

export async function campaignByBrand(req, res) {
  try {
    const chatIds = await getChannelsByBrand(req.params.id);
    const message = req.body.message;
    const file_url = req.body.file_url;
    const captionText = req.body.captionText;
    const file_type = req.body.file_type;
    let delay = req.body.delay;
    let starttime = req.body.starttime;

    starttime = starttime - Date.now();

    if (starttime<=0)
        starttime = 10000
    telegramQueueAddJob({TelegramB, message, chatIds, file_type, file_url, captionText, delay}, starttime)
    

    res.json({
      message: message,
      file: file_url,
      captionText: captionText,
      chatIds: chatIds,
    });
  } catch (error) {
    return systemError.sendError(res, error);
  }
}





export async function deleteMessage(req, res) {


  try {
    const message_id = req.body.message_id;
    const channel_id = req.body.channel_id;
    const brand = req.body.brand
    let acountToken = await getAccount(group.brand, "TELEGRAM");
    acountToken = acountToken.account.token
    const tb =  new TelegramB(acountToken)
    await tb.bot.deleteMessage(channel_id, Number(message_id));
    await DeleteTelegramMessage(channel_id, message_id, brand);
    tb.cleanUp()
    res.json({
      m: "Message deleted successfully!",
      message_id: message_id,
      channel_id: channel_id,
    });
  } catch (error) {
    console.error(error);
    return systemError.sendError(res, error);
  }
}



export async function get_subscripers(req, res) {
  try {
    // console.log(req.body.brand);

    const subs = await GetSubCount(req.params.id);
    res.json({ subscribers: subs });
  } catch (error) {
    return systemError.sendError(res, error);
  }
}




  //====================================


try {
  cron.schedule('0 */6 * * *', async () => {

    const groups = await getChannels();
    groups.forEach(async(group)=>{

      try {
        let acountToken = await getAccount(group.brand, "TELEGRAM");
        acountToken = acountToken.account.token
        const tb =  new TelegramB(acountToken)
        group.subscribers = await await tb.bot.getChatMemberCount(group.group_id);
        group.save()
        tb.cleanUp()
      } catch (error) {
          console.log(error)
      }

    })
    
  });
} catch (error) {
  console.log(error)
}

//===================================
