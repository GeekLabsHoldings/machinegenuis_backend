import axios from 'axios';
import qs from 'qs';
import SocialMediaGroups from "../../Model/SocialMedia/SocialMediaGroups.model";
import SocialMediaPosts from "../../Model/SocialMedia/SocialMediaPosts.models";
import SocialPostingAccount from '../../Model/Operations/SocialPostingAccount.model';
import crypto from 'crypto';
import moment from 'moment';
import { console } from 'inspector';
import systemError from "../../Utils/Error/SystemError";
import redditQueue from "../../Utils/CronJobs/RedisQueue/reddit.social"





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



const snoowrap = require('snoowrap');
const jwt = require('jsonwebtoken');

const userAgent = 'nodejs:snoowrap:myapp:v1.0.0 (by hassan gad 2023)'

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

export async function saveAccount(req){
  console.log('Saving account...');

  const result = await SocialPostingAccount.deleteOne({ platform:"REDDIT", brand:req.body.brand});

  if (result.deletedCount === 1) {
    console.log('Message deleted successfully!');
  } else {
    console.log('Message not found.');
  }

  let payload = { appID: req.body.appID, appSecret: req.body.appSecret, username: req.body.username, password:req.body.password };
  payload = JSON.stringify(payload)
  const token = encrypt(payload)

 
  const redditAccount = new SocialPostingAccount({
    token: token, 
    platform: "REDDIT",
    brand:req.body.brand
  });

  redditAccount.save()


}





export async function getAccount(brand){

    let account
    if(brand){
       account = await SocialPostingAccount.findOne({platform:"REDDIT", brand:brand})
    }
    if(!account){
      account = await SocialPostingAccount.findOne({platform:"REDDIT", brand:"66fa6d4321b187544fd1c6ce"})
    }

    const payload = decrypt(account.token)
    const obj = JSON.parse(payload)


    return  obj;

}







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
r,
messageId,
) =>{
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

}



export const GetSubCount = async(
brand
)=>{
  const channels = await SocialMediaGroups.find({brand:brand, platform:"REDDIT"})

  let sum=0
  console.log(channels, brand)
  channels.forEach(channel=>{
    sum+=channel.subscribers})

  return sum;

}






export async function getSubredditSubs(r, subredditName) {
  const sub = await r.getSubreddit(subredditName);
    
  // Access the subscribers property
  const subscribers = await sub.subscribers;  
  return subscribers; // Return the number of subscribers if needed
}






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