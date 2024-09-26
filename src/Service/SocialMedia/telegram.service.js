import { channel } from "diagnostics_channel";
import SocialMediaGroups from "../../Model/SocialMedia/SocialMediaGroups.model";
import SocialMediaPosts from "../../Model/SocialMedia/SocialMediaPosts.models";
import axios from 'axios';


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
) => {
  const newMessage = new SocialMediaPosts({
    post_id: post_id,
    group_name: group_name,
    group_id: String(group_id), 
    timestamp: timestamp,
  });

  await newMessage.save();
}  


export const DeleteTelegramMessage = async(
  channelId,
  messageId
) =>{
  try {
    const result = await SocialMediaPosts.deleteOne({ platform:"TELEGRAM",channel_id:channelId, message_id:messageId });
    
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
    console.error('Error submitting to Reddit:', error.response?.data || error.message);
    // Return error details if needed or rethrow
    return {
      error: error.response?.data || error.message
    };
  }
}


