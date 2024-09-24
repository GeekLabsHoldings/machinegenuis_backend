import axios from 'axios';
import qs from 'qs';


const userAgent = 'OpenAI/1.0.0 (by /u/YOUR_REDDIT_USERNAME)'

export const submitRedditPost = async ({token, title, text, subreddit}) => {
    const url = 'https://oauth.reddit.com/api/submit';
    
    // Prepare the x-www-form-urlencoded data using qs
    const postData = qs.stringify({
      api_type: 'json',
      kind: 'self',   // Text post
      title: title,
      text: text,
      sr: subreddit,  // Subreddit name without /r/
    });
  
    try {
      const response = await axios.post(url, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
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
  };

//===========================================================
//===========================================================
//===========================================================


export const CreateRedditPost = async ({token, title, text, img_url, subreddit}) => {
    const url = 'https://oauth.reddit.com/api/submit';
    
    // Prepare the x-www-form-urlencoded data using qs
    const postData = qs.stringify({
      api_type: 'json',
      kind: 'link',   // Text post
      title: title,
      url:img_url,
      text: text,
      sr: subreddit,  // Subreddit name without /r/
    });
  
    try {
      const response = await axios.post(url, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': userAgent,
        },
      });
  
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
  };



  export const AddRedditPostDB = async (
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








export async function getSubredditSubs(accessToken, subredditName) {
    const response = await axios.get(`https://oauth.reddit.com/r/${subredditName}/about`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': userAgent,
        }
    });
    
    return response.data.data.subscribers; // Subscribers count
}




export const AddSubreddit = async (
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


export const getSubreddits = async ()=>{
try {
  const groups = await SocialMediaGroups.find({platform:"REDDIT"});
  return groups
} catch (error) {
  console.error('Error fetching telegram channels:', error);
  return []
}
}

export const getSubredditsByBrand = async (brandName)=>{
try {
  const groups = await SocialMediaGroups.find({ brand: brandName, platform:"REDDIT" });
  return groups
} catch (error) {
  console.error('Error fetching telegram channels:', error);
  return []
}
}





export const DeleteRedditPost = async(
accessToken,
group_name,
messageId
) =>{
  const result = await SocialMediaPosts.deleteOne({ platform:"REDDIT",group_name:group_name, messageId:messageId });
  
  if (result.deletedCount === 1) {
    console.log('Message deleted successfully!');
  } else {
    console.log('Message not found.');
  }

  const response = await axios.post('https://oauth.reddit.com/api/del', 
    new URLSearchParams({
        id: postId
    }), 
    {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': userAgent,
        }
    }
);

return response.data;

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