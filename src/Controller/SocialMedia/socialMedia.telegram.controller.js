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
  cronSchedule,
  saveAccount,
  getAccount
} from "../../Service/SocialMedia/telegram.service";
import systemError from "../../Utils/Error/SystemError";
const crypto = require('crypto');
const cron = require('node-cron');



class TelegramB { 
  constructor(token){
    if(!token)
      token = process.env.TELEGRAMBOT_ACCESS_TOKEN

   // console.log("token: " + token);
    this.bot= new TelegramBot(token, {
      polling: true,
    });
    
    this.bot.on('polling_error', () => {
      // Do nothing, prevent logging
    });
  }
  async cleanUp(){
    await CleanUp()
  }
    
}



export async function AddAnAccount(req , res){
  try {
    await saveAccount(req, res)
    res.json({message:"done"})
  } catch (error) {
    console.error("Error adding group:", error);
    return systemError.sendError(res, error);
  }
  }



export async function add_channel(req, res) {
  try {
    const { group_name, link, group_id, niche, brand, platform, engagement } =
      req.body;

    const acountToken = await getAccount(req.body.brand);
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
    const channels = await getChannelsByBrand(req.body.brand);
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
    const ms = req.body.ms;
    const hour = req.body.hour;
    const minute = req.body.minute;
    const timezone = req.body.timezone;


    const cronSchedulet = cronSchedule(hour, minute, timezone)
    const task = cron.schedule(cronSchedulet, async() => {


      await sendMessageToAll(
        TelegramB,
        message,
        chatIds,
        file_type,
        file_url,
        captionText,
        ms
      );
      // Stop the task after it runs
      task.stop();
    });

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
    const chatIds = await getChannelsByBrand(req.body.brand);
    const message = req.body.message;
    const file_url = req.body.file_url;
    const captionText = req.body.captionText;
    const file_type = req.body.file_type;
    const ms = req.body.ms;
    const hour = req.body.hour;
    const minute = req.body.minute;
    const timezone = req.body.timezone;


    const cronSchedulet = cronSchedule(hour, minute, timezone)
    const task = cron.schedule(cronSchedulet, async() => {

      await sendMessageToAll(
        TelegramB,
        message,
        chatIds,
        file_type,
        file_url,
        captionText,
        ms
      );
      // Stop the task after it runs
      task.stop();
    });

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
    const acountToken = await getAccount(brand);
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

    const subs = await GetSubCount(req.body.brand);
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
      const acountToken = await getAccount(group.brand);
      const tb =  new TelegramB(acountToken)
      group.subscribers = await await tb.bot.getChatMemberCount(group.group_id);
      group.save()
      tb.cleanUp()
    })
    
  });
} catch (error) {
  
}

//===================================
