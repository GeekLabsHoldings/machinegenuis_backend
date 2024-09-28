import { channel } from "diagnostics_channel";
import SocialMediaGroups from "../../Model/SocialMedia/SocialMediaGroups.model";
import SocialMediaPosts from "../../Model/SocialMedia/SocialMediaPosts.models";
import axios from 'axios';
import moment from "moment";
import systemError from "../../Utils/Error/SystemError";
import RedditAccountModel from '../../Model/SocialMedia/RedditAccount.model';
import crypto from 'crypto';


// Secret key (32 bytes for AES-256)

function encrypt(text) {
  const secretKey =  Buffer.from(process.env.ENCRYPTION_SECRET_KEY, 'hex');

  const cipher = crypto.createCipheriv('aes-256-ecb', secretKey, null); // No IV for ECB
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decrypt function using AES-256-ECB
function decrypt(encryptedData) {
  const secretKey =  Buffer.from(process.env.ENCRYPTION_SECRET_KEY, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-ecb', secretKey, null); // No IV for ECB
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}




export async function saveAccount(req,res){

  try {
    
    const result = await RedditAccountModel.deleteOne({ platform:"REDDIT", brand:req.body.brand});
  
    if (result.deletedCount === 1) {
      console.log('Message deleted successfully!');
    } else {
      console.log('Message not found.');
    }
  

    const token = encrypt(req.body.token);
  
    const redditAccount = new RedditAccountModel({
      token: token, 
      platform: "TELEGRAM",
      brand:req.body.brand
    });
  
    redditAccount.save()
  } catch (error) {
    console.log(error)
  }
  
  
}
  
  
  
  
  
  export async function getAccount(brand){
    try {
      let account
      if(brand){
         account = await RedditAccountModel.findOne({platform:"TELEGRAM", brand:brand})
      }else{
         account = await RedditAccountModel.findOne({platform:"TELEGRAM",})
      }
      //console.log("account", account)
      const token = decrypt(account.token)
      return token;
    } catch (error) {
      console.error(error);

    }
  }
  
  
  


export const AddTelegramChannel = async (
    group_name,
    link,
    group_id,
    subscribers,
    niche,
    brand,
    platform,
    engagement
  ) => {
    try {
        // Create a new group record
        const newGroup = new SocialMediaGroups({
            group_name: group_name,
            link: link,
            group_id: group_id,
            subscribers: subscribers,
            niche: niche,
            brand: brand,
            platform:platform,
            engagement: engagement
        });

        // Save the group to the database
        const savedGroup = await newGroup.save();
        console.log('Group added:', savedGroup);
        return savedGroup
    } catch (error) {
        console.error('Error adding group:', error);
        return null
    } 
  };


export const getChannels = async ()=>{
  try {
    const groups = await SocialMediaGroups.find({platform:"TELEGRAM"});
    return groups
  } catch (error) {
    console.error('Error fetching telegram channels:', error);
    return []
  }
}

export const getChannelsByBrand = async (brandName)=>{
  try {
    const groups = await SocialMediaGroups.find({ brand: brandName, platform:"TELEGRAM" });
    return groups
  } catch (error) {
    console.error('Error fetching telegram channels:', error);
    return []
  }
}


export const AddTelegramMessage = async (
  post_id,
  group_name,
  group_id,
  timestamp,
  brand
) => {
  const newMessage = new SocialMediaPosts({
    post_id: post_id,
    group_name: group_name,
    group_id: String(group_id), 
    timestamp: timestamp,
    platform:"TELEGRAM",
    brand:brand
  });

  await newMessage.save();
}  


export const DeleteTelegramMessage = async(
  channelId,
  messageId,
  brand
) =>{
  try {
    const result = await SocialMediaPosts.deleteOne({ platform:"TELEGRAM",group_id:channelId, post_id:messageId, brand:brand });
    
    if (result.deletedCount === 1) {
      console.log('Message deleted successfully!');
    } else {
      console.log('Message not found.');
    }
  } catch (error) {
    console.error('Error deleting message:', error);
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







export const CleanUp = async()=>{
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN_SECRET}/deleteWebhook`
  try {
    const response = await axios.post(url, {});

    const responseData = response.data
    return {
      ...responseData
      
    };
  } catch (error) {
    console.error('telegram cleanUp:', error.response?.data || error.message);
    // Return error details if needed or rethrow
    return {
      error: error.response?.data || error.message
    };
  }
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export const sendMessageToAll = (
  TelegramB,
  message,
  chatIds,
  file_type,
  file_url,
  captionText, 
  ms
) => {
  chatIds.forEach(async(chatId) => {
    const acountToken = await getAccount(chatId.brand);
    console.log(`this is ${chatId.brand} acountToken: ${acountToken}`);
    const tb =  new TelegramB(acountToken)
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
    tb.cleanUp()
    delay(ms)
  });

  
   
};



export function cronSchedule(h, m, userTimeZone) {


  /*
      for example:
      
      userInputTime = '00:59'; // User's input time
      userTimeZone = 'Africa/Cairo'; // User's input time zone

  */ 

   
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
  const day = String(today.getDate()).padStart(2, '0');
  h = String(h).padStart(2, '0');
  m = String(m).padStart(2, '0');

  const userInputTime = `${year}-${month}-${day} ${h}:${m}`;

  const serverTimeZone = moment.tz.guess(); // Get the server's local time zone

  // Convert user input time to server local time
  const userTime = moment.tz(userInputTime, userTimeZone); // User's time
  const serverLocalTime = userTime.clone().tz(serverTimeZone); // Convert to server local time

  // Get minute and hour from the server local time
  const minute = serverLocalTime.minutes();
  const hour = serverLocalTime.hours();

  // Cron schedule string
  const cronSchedule = `${minute} ${hour} * * *`; // Schedule for every day at the specified time


 
  return cronSchedule;
}