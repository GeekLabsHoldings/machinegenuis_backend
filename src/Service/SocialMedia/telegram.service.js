import { channel } from "diagnostics_channel";
import SocialMediaGroups from "../../Model/SocialMedia/SocialMediaGroups.model";
import SocialMediaPosts from "../../Model/SocialMedia/SocialMediaPosts.models";
import axios from 'axios';
import moment from "moment";
import systemError from "../../Utils/Error/SystemError";
import SocialPostingAccount from "../../Model/Operations/SocialPostingAccount.model";
import crypto from 'crypto';
import { getAccount } from "../Operations/BrandCreation.service";
import { log } from "console";

// Secret key (32 bytes for AES-256)

function encrypt(text) {

  try {
    const secretKey =  Buffer.from(process.env.ENCRYPTION_SECRET_KEY, 'hex');

    const cipher = crypto.createCipheriv('aes-256-ecb', secretKey, null); // No IV for ECB
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.log(error)
  }

}

// Decrypt function using AES-256-ECB
function decrypt(encryptedData) {
  try {
  const secretKey =  Buffer.from(process.env.ENCRYPTION_SECRET_KEY, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-ecb', secretKey, null); // No IV for ECB
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
  } catch (error) {
    console.log(error)
  }
  
}




export async function saveAccount(req,res){

  try {
    const result = await SocialPostingAccount.deleteOne({ platform:"TELEGRAM", brand:req.body.brand});
  
    if (result.deletedCount === 1) {
      console.log('Message deleted successfully!');
    } else {
      console.log('Message not found.');
    }
  

    const token = encrypt(req.body.token);
  
    const redditAccount = new SocialPostingAccount({
      token: token, 
      platform: "TELEGRAM",
      brand:req.body.brand
    });
  
    redditAccount.save()
  } catch (error) {
    console.log(error)
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
  try {
    const newMessage = new SocialMediaPosts({
      post_id: post_id,
      group_name: group_name,
      group_id: String(group_id), 
      timestamp: timestamp,
      platform:"TELEGRAM",
      brand:brand
    });
  
    await newMessage.save();
  } catch (error) {
    console.log(error); 
  }

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
  try {
    const channels = await SocialMediaGroups.find({brand:brand, platform:"TELEGRAM"})

    let sum=0
    console.log(channels, brand)
    channels.forEach(channel=>{
      sum+=channel.subscribers})
  
    return sum;

  } catch (error) {
    console.log()
  }
    
}







export const CleanUp = async(token)=>{
  const url = `https://api.telegram.org/bot${token}/deleteWebhook`
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

    try {
      let acountToken = await getAccount(chatId.brand, "TELEGRAM");
      acountToken = acountToken.account.token
      const tb =  new TelegramB(acountToken)
      console.log("group_id  ", chatId.group_id,"chat_ brand",chatId.brand, "account token", acountToken);
      
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
  
    } catch (error) {
      console.log(error)
    }
  });
};


