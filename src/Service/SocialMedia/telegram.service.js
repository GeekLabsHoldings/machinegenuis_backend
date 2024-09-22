import telegramModel from "../../Model/SocialMedia/Telegram.socialMedia.model";



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
        return
    } 
  };
export const getChannels = async ()=>{
  try {
    const groups = await telegramModel.find();
  } catch (error) {
    console.error('Error fetching telegram channels:', error);
  }
}


