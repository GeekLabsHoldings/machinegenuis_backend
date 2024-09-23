import { channel } from "diagnostics_channel";
import telegramModel from "../../Model/SocialMedia/Telegram.socialMedia.model";
import TelegramMessage from "../../Model/SocialMedia/telegramMessage.model";


export const AddTwitterChannel = async (
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
        const newGroup = new telegramModel({
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
    const groups = await telegramModel.find();
    return groups
  } catch (error) {
    console.error('Error fetching telegram channels:', error);
    return []
  }
}

export const getChannelsByBrand = async (brandName)=>{
  try {
    const groups = await telegramModel.find({ brand: brandName });
    return groups
  } catch (error) {
    console.error('Error fetching telegram channels:', error);
    return []
  }
}


export const AddTelegramMessage = async (
  message_id,
  text,
  channel_id,
  timestamp,
) => {
  const newMessage = new TelegramMessage({
    message_id: message_id,
    text: text,
    channel_id: String(channel_id), 
    timestamp: timestamp,
  });

  await newMessage.save();
}  


export const DeleteTelegramMessage = async(
  channelId,
  messageId
) =>{
  try {
    const result = await TelegramMessage.deleteOne({ channel_id:channelId, message_id:messageId });
    
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
    const channels = await telegramModel.find({brand:brand})

    let sum=0
    console.log(channels, brand)
    channels.forEach(channel=>{
      console.log(channel)
      sum+=channel.subscribers})
    
    const result = await telegramModel.aggregate([
      { $match: { brand: brand } },
      { $group: { _id: null, totalSubscribers: { $sum: "$subscribers" } } }
  ]);
  
    return sum;

}

