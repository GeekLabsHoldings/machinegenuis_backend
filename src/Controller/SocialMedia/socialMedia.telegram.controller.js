const TelegramBot = require("node-telegram-bot-api");
import {
  AddTelegramChannel,
  getChannels,
  AddTelegramMessage,
  getChannelsByBrand,
  DeleteTelegramMessage,
  GetSubCount,
  CleanUp
} from "../../Service/SocialMedia/telegram.service";
import systemError from "../../Utils/Error/SystemError";



class TelegramB { 
  constructor(){
    this.bot= new TelegramBot(process.env.TELEGRAM_BOT_TOKEN_SECRET, {
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


export async function add_channel(req, res) {
  try {
    const { group_name, link, group_id, niche, brand, platform, engagement } =
      req.body;
    const tb =  new TelegramB()
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
    // const tb =  new TelegramB()
    // const subscribers = await tb.bot.getChatMemberCount(group_id);
    // tb.cleanUp()
    //   groups.forEach(async(group)=>{
    //   group.subscribers = await RedditServices.getSubredditSubs(r, group.group_name)
    //   group.save()
    // })
    const groups = await getChannels();
    res.status(200).json({ channels: groups }); // Respond with all the groups
  } catch (error) {
    console.error("Error fetching groups:", error);
    return systemError.sendError(res, error);
  }
}

const sendMessageToAll = (
  message,
  chatIds,
  file_type,
  file_url,
  captionText
) => {
  const tb =  new TelegramB()
  chatIds.forEach((chatId) => {
    console.log("group_id  ", chatId.group_id);
    
    if (message) {
      console.log("message\n", message.chat, message.date);
      
        tb.bot.sendMessage(chatId.group_id, message)
        .then((messageData) => {
          AddTelegramMessage(
            messageData.message_id,
            messageData.chat.title,
            messageData.chat.id,
            messageData.date,
            chatId.brand
          );
          console.log(`Message sent to chat ID: ${chatId}`);
        })
        .catch((err) => {
          console.error(
            `~~~~~~Failed to send message to chat ID: ${chatId}`,
            err
          );
        });
    }
    if (file_url !== "") {
      if (file_type == "photo") {
        console.log("sending a photo \n\n");
        tb.bot
          .sendPhoto(chatId.group_id, file_url, { caption: captionText })
          .then((messageData) => {
            AddTelegramMessage(
              messageData.message_id,
              messageData.chat.title,
              messageData.chat.id,
              messageData.date,
              chatId.brand
            );

            console.log(`file sent to chat ID: ${chatId}`);
          })
          .catch((err) => {
            console.error(
              `~~~~~~Failed to send file to chat ID: ${chatId}`,
              err
            );
          });
      } else if (file_type == "video") {

        tb.bot
          .sendVideo(chatId.group_id, file_url, { caption: captionText })
          .then((messageData) => {
            AddTelegramMessage(
              messageData.message_id,
              messageData.chat.title,
              messageData.chat.id,
              messageData.date,
              chatId.brand
            );

            console.log(`file sent to chat ID: ${chatId}`);
          })
          .catch((err) => {
            console.error(
              `~~~~~~Failed to send file to chat ID: ${chatId}`,
              err
            );
          });
      } else if (file_type == "voice") {
        console.log("sending a voice \n\n");

        tb.bot
          .sendVoice(chatId.group_id, file_url, { caption: captionText })
          .then((messageData) => {
            AddTelegramMessage(
              messageData.message_id,
              messageData.chat.title,
              messageData.chat.id,
              messageData.date,
              chatId.brand
            );

            console.log(`file sent to chat ID: ${chatId}`);
          })
          .catch((err) => {
            console.error(
              `~~~~~~Failed to send file to chat ID: ${chatId}`,
              err
            );
          });
      } else {

        tb.bot
          .sendDocument(chatId.group_id, file_url, { caption: captionText })
          .then((messageData) => {
            AddTelegramMessage(
              messageData.message_id,
              messageData.chat.title,
              messageData.chat.id,
              messageData.date,
              chatId.brand
            );
            
            console.log(`file sent to chat ID: ${chatId}`);
          })
          .catch((err) => {
            console.error(
              `~~~~~~Failed to send file to chat ID: ${chatId}`,
              err
            );
          });

      }
    }
  });

  tb.cleanUp()
   
};

export async function campaign(req, res) {
  try {
    const chatIds = await getChannels();
    const message = req.body.message;
    const file_url = req.body.file_url;
    const captionText = req.body.captionText;
    const file_type = req.body.file_type;
    await sendMessageToAll(
      message,
      chatIds,
      file_type,
      file_url,
      captionText
    );
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

export async function campaignByBrand(req, res) {
  try {
    const chatIds = await getChannelsByBrand(req.body.brand);
    const message = req.body.message;
    const file_url = req.body.file_url;
    const captionText = req.body.captionText;
    const file_type = req.body.file_type;
    await sendMessageToAll(
      message,
      chatIds,
      file_type,
      file_url,
      captionText
    );
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
  const message_id = req.body.message_id;
  const channel_id = req.body.channel_id;

  try {
    await bot.deleteMessage(channel_id, Number(message_id));
    await DeleteTelegramMessage(Number(channel_id), Number(message_id));
    res.json({
      m: "Message deleted successfully!",
      message_id: message_id,
      channel_id: channel_id,
    });
  } catch (error) {
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

export async function get_subscripers(req, res) {
  try {
    console.log(req.body.brand);

    const subs = await GetSubCount(req.body.brand);
    res.json({ subscribers: subs });
  } catch (error) {
    return systemError.sendError(res, error);
  }
}

export const GetSubCount = async(
  brand
  )=>{
      const channels = await SocialMediaGroups.find({brand:brand, platform:"TELEGRAM"})
  
      let sum=0
      console.log(channels, brand)
      channels.forEach(channel=>{
        console.log(channel)
        sum+=channel.subscribers})
    
      return sum;
  
  }