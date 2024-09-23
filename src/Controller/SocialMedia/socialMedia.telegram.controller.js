const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');

import { group } from "console";
import { AddTwitterChannel,getChannels, AddTelegramMessage, getChannelsByBrand, DeleteTelegramMessage, GetSubCount } from "../../Service/SocialMedia/telegram.service";


const token = '7610974787:AAHC9I1pxEms1jW9Hm4G1Ej9rZYnxivVY_E';


const bot = new TelegramBot(token, { polling: true });


export async function add_channel(req,res){


    try{
        console.log("channel body    ", req.body)
        
        const { group_name, link, group_id, niche, brand,platform, engagement } = req.body;
        const subscribers = await bot.getChatMemberCount(group_id)

        const newGroup = await AddTwitterChannel(group_name,
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
        console.error('Error adding group:', error);
        res.status(500).json({ message: 'Error adding group' });
    }
}


export async function get_channels(req,res){
    try {
        const groups = await getChannels()
        res.status(200).json({channels:groups}); // Respond with all the groups
        } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Error fetching groups' });
    }   
}


const sendMessageToAll = (message, bot, chatIds ,file_type, file, captionText) => {
    chatIds.forEach((chatId) => {
      console.log("group_id  ",  chatId.group_id )
      if (message){
        console.log("message\n",message.chat, message.date)
        bot.sendMessage(chatId.group_id, message)
          .then((messageData) => {
             AddTelegramMessage(messageData.message_id, message, messageData.chat.id, messageData.date, )
            console.log(`Message sent to chat ID: ${chatId}`);
          })
          .catch((err) => {
            console.error(`~~~~~~Failed to send message to chat ID: ${chatId}`, err);
          });
      }
      if (file){
        console.log("this is file \n", file)
        if (file_type == "photo"){
          console.log("sending a photo \n\n")
          bot.sendPhoto(chatId.group_id, file.path , { caption: captionText, })
          .then((messageData) => {
             AddTelegramMessage(messageData.message_id, captionText, messageData.chat.id, messageData.date, )
            console.log(`file sent to chat ID: ${chatId}`);
          })
          .catch((err) => {
            console.error(`~~~~~~Failed to send file to chat ID: ${chatId}`, err);
          });
        }
        else if (file_type == "video"){
          console.log("sending a video \n\n", file)
          bot.sendVideo(chatId.group_id, file.path , { caption: captionText, })
          .then((messageData) => {
             AddTelegramMessage(messageData.message_id,  captionText, messageData.chat.id, messageData.date, )
            console.log(`file sent to chat ID: ${chatId}`);
          })
          .catch((err) => {
            console.error(`~~~~~~Failed to send file to chat ID: ${chatId}`, err);
          });
        }
        else if (file_type == "voice"){
          console.log("sending a voice \n\n")
          bot.sendVoice(chatId.group_id, file.path , { caption: captionText, })
          .then((messageData) => {
             AddTelegramMessage(messageData.message_id,  captionText, messageData.chat.id, messageData.date, )
            console.log(`file sent to chat ID: ${chatId}`);
          })
          .catch((err) => {
            console.error(`~~~~~~Failed to send file to chat ID: ${chatId}`, err);
          });
        }
        else{
          bot.sendDocument(chatId.group_id, file.path , { caption: captionText, })
          .then((messageData) => {
             AddTelegramMessage(messageData.message_id, captionText, messageData.chat.id, messageData.date, )
            console.log(`file sent to chat ID: ${chatId}`);
          })
          .catch((err) => {
            console.error(`~~~~~~Failed to send file to chat ID: ${chatId}`, err);
          });
        }
        
        
      }
    });
  };


export async function campaign(req,res){

  try{ 
     const chatIds = await getChannels()
    const message = req.body.message
    const file = req.file;
    const captionText = req.body.captionText
    const file_type = req.body.file_type
    await sendMessageToAll(message, bot, chatIds,file_type, file, captionText)
    res.json({message:message, file:file,captionText:captionText, chatIds: chatIds}) 
   }
  catch(error){
    res.status(500).json(`something went wrong ${error}`)
  }
  
}


export async function campaignByBrand(req,res){



    try{      
      const chatIds = await getChannelsByBrand(req.body.brand)
      const message = req.body.message
      const  captionText  = req.body.captionText
      const file = req.file;
      const file_type = req.body.file_type
      await sendMessageToAll(message, bot, chatIds,file_type, file, captionText)
      res.json({message:message, file:file,captionText:captionText, chatIds: chatIds})  
     }
    catch(error){
      res.status(500).json(`something went wrong ${error}`)
    }
}



export async function deleteMessage(req,res) {

  const message_id = req.body.message_id
  const channel_id = req.body.channel_id

  try {
    await bot.deleteMessage(channel_id, message_id);
    await DeleteTelegramMessage(Number(channel_id),Number( message_id))
    res.json( {m:'Message deleted successfully!', message_id:message_id, channel_id:channel_id});
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json('Failed to delete message.');
  }

}

export async function  get_channels_brand(req,res){
try{
  const channels = await getChannelsByBrand(req.body.brand)
  res.json(channels)
}
catch(error){
console.log("something went wrong ", error)
res.status(500).json("something went wrong ")
}

}

export async function  get_subscripers(req,res) {
try {
        console.log(req.body.brand);
        
        const subs = await GetSubCount(req.body.brand)
        res.json({subscribers:subs})
    } catch (error) {
        console.error("Error summing subscribers:", error);
        res.status(500).json("something went wrong")
    }

}
// bot.onText(/\/campaign/, (msg, match) => {
//     const chatId = msg.chat.id;
//     const text = msg.text;
//     const username = msg.from.username;
//     console.log("hi")
//     console.log("username:      ",username)
  
//     if (username !== "@HasanGad_Elrub"){      
//       console.error("not authraized")
//         return}
  
  
//     // Prepare the broadcast message
  
  
//     const broadcastMessage = `Broadcast message triggered by @Compigan: ${text}`;
  
//     // Acknowledge the sender that the message is being broadcast
//     bot.sendMessage(chatId, `Broadcasting message: ${broadcastMessage}`);
  
//     // Broadcast the message to all groups and channels
//     sendMessageToAll(broadcastMessage);
//   });


// bot.sendMessage(-1002440854240, "hi")
// .then(() => {
//   console.log(`Message sent to chat ID: ${-1002440854240}`);
// })
// .catch((err) => {
//   console.error(`~~~~~~Failed to send message to chat ID: ${-1002440854240}`, err);
// });
// // Create a bot instance 
