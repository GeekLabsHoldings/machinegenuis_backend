const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');

import { AddTwitterChannel,getChannels, AddTelegramMessage, getChannelsByBrand } from "../../Service/SocialMedia/telegram.service";


const token = '7610974787:AAHC9I1pxEms1jW9Hm4G1Ej9rZYnxivVY_E';
const bot = new TelegramBot(token, { polling: true });


export async function add_channel(req,res){
    try{
        const { group_name, link, group_id, subscribers, niche, brand, engagement } = req.body;
        const newGroup = await AddTwitterChannel(group_name,
            link,
            group_id,
            subscribers,
            niche,
            brand,
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


const sendMessageToAll = (message, bot, chatIds , file) => {
    chatIds.forEach((chatId) => {
      if (message){
        bot.sendMessage(chatId, message)
          .then((message) => {
            AddTelegramMessage()
            console.log(`Message sent to chat ID: ${chatId}`);
          })
          .catch((err) => {
            console.error(`~~~~~~Failed to send message to chat ID: ${chatId}`, err);
          });
      }
      if (file){
        bot.sendDocument(channelId, file.path)
        .then((message) => {
          AddTelegramMessage()
          console.log(`file sent to chat ID: ${chatId}`);
        })
        .catch((err) => {
          console.error(`~~~~~~Failed to send file to chat ID: ${chatId}`, err);
        });
      }
    });
  };


export async function campaign(req,res){

    const chatIds = await getChannels()
    const message = req.body.message
    const file = req.file;
    sendMessageToAll(message, bot, chatIds, file)
    res.json("done")  
}


export async function campaignByBrand(req,res){

    const chatIds = await getChannelsByBrand(req.body.brand)
    const message = req.body.message
    const file = req.file;
    sendMessageToAll(message, bot, chatIds, file)
    res.json("done")  
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
