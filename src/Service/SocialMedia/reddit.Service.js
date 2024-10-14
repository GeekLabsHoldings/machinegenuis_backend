import axios from 'axios';
import qs from 'qs';
import SocialMediaGroups from "../../Model/SocialMedia/SocialMediaGroups.model";
import SocialMediaPosts from "../../Model/SocialMedia/SocialMediaPosts.models";
import SocialPostingAccount from '../../Model/Operations/SocialPostingAccount.model';
import crypto from 'crypto';
import moment from 'moment';
import systemError from "../../Utils/Error/SystemError";
import redditQueue from "../../Utils/CronJobs/RedisQueue/reddit.social"
import { getAccount } from '../Operations/BrandCreation.service';






const snoowrap = require('snoowrap');
const jwt = require('jsonwebtoken');


const userAgent = 'geek_app:node:v1.2.11 (by a geek)'


// export const submitRedditPost = async ({token, title, text, subreddit}) => {
//     const url = 'https://oauth.reddit.com/api/submit';
    
//     // Prepare the x-www-form-urlencoded data using qs
//     const postData = qs.stringify({
//       api_type: 'json',
//       kind: 'self',   // Text post
//       title: title,
//       text: text,
//       sr: subreddit,  // Subreddit name without /r/
//     });
  
//     try {
//       const response = await axios.post(url, postData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       });
  
//       const responseData = response.data
//       return {
//         ...responseData
        
//       };
//     } catch (error) {
//       console.error('Error submitting to Reddit:', error.response?.data || error.message);
//       // Return error details if needed or rethrow
//       return {
//         error: error.response?.data || error.message
//       };
//     }
//   };

//===========================================================
//===========================================================
//===========================================================





export async function getsnoowrap(clientId,clientSecret,username,password) {
  try {
    const r = new snoowrap({

      userAgent:userAgent,
        clientId: clientId,
        clientSecret: clientSecret,
        username: username,
        password: password
      });
      r.getMe()
      return r
  } catch (error) {
    console.log(error)
  }
  
  }




export const CreateRedditPost = async (r, title, text, img_url, sr) => {
  try{

    if (img_url)
     return await r.getSubreddit(sr)
      .submitLink({
            title: title,
            text:text,
            url: img_url
          });
      
    return await r.getSubreddit(sr)
      .submitSelfpost({
            title: title,
            text:text,
          });
    } catch (error) {
      console.error('Error submitting to Reddit:', error.response?.data || error.message);
    }
  };






  export const AddRedditPostDB = async (
    post_id,
    group_name,
    group_id,
    timestamp,
    brand,
    ) => {

    try {
      const newMessage = new SocialMediaPosts({
        post_id: post_id,
        group_name: group_name,
        group_id: String(group_id), 
        timestamp: timestamp,
        platform: "REDDIT",
        brand:brand
      });
      
      await newMessage.save();
    } catch (error) {
    console.log(error)
  }
   
}  







export const AddSubreddit = async (
  group_name,
  link,
  group_id,
  subscribers,
  niche,
  brand,
  engagement,
  res
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
          platform:"REDDIT",
          engagement: engagement
      });

      // Save the group to the database
      const savedGroup = await newGroup.save();
      console.log('Group added:', savedGroup);
      return savedGroup
  } catch (error) {
      console.error('Error adding group:', error);
       return systemError.sendError(res, error);
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





export const getSubredditsByBrand = async (brandName, personal=false)=>{
try {
  const groups = await SocialMediaGroups.find({ brand: brandName, personal:personal, platform:"REDDIT" });
  return groups
} catch (error) {
  console.error('Error fetching telegram channels:', error);
  return []
}
}





export const DeleteRedditPost = async(
r,
messageId,
) =>{

  try {
    const result = await SocialMediaPosts.deleteOne({ platform:"REDDIT", post_id:messageId });
  
    if (result.deletedCount === 1) {
      console.log('Message deleted successfully!');
    } else {
      console.log('Message not found.');
    }
  
  
      // Get the submission object using the ID
      const submission = await r.getSubmission(messageId);
      
      // Delete the post
      await submission.delete();
      
      console.log(`Post with ID ${messageId} has been deleted successfully.`);
   
  
  return submission;
  } catch (error) {
    console.log(error);
    
  }
}



export const GetSubCount = async(
brand
)=>{

  try {
    const channels = await SocialMediaGroups.find({brand:brand, platform:"REDDIT"})

    const sum = channels.reduce((total, channel) => total + Number(channel.subscribers), 0);
    
    return sum;
  } catch (error) {
    console.log(error)
  }
}






export async function getSubredditSubs(r, subredditName) {

  try {
    const sub = await r.getSubreddit(subredditName);
    
    // Access the subscribers property
    const subscribers = await sub.subscribers;  
    return subscribers; // Return the number of subscribers if needed
  } catch (error) {
    console.log(error)
  }
}




