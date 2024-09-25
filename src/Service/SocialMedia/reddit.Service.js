import axios from 'axios';
import qs from 'qs';
import SocialMediaGroups from "../../Model/SocialMedia/SocialMediaGroups.model";
import SocialMediaPosts from "../../Model/SocialMedia/SocialMediaPosts.models";
import twitterModel from '../../Model/SocialMedia/TwitterData.model';

const snoowrap = require('snoowrap');
const jwt = require('jsonwebtoken');

const userAgent = 'axios:myapp/1.0.0 (by Hasan_Gad)'

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


  const result = await twitterModel.deleteOne({ platform:"REDDIT", brand:req.body.brand});

  if (result.deletedCount === 1) {
    console.log('Message deleted successfully!');
  } else {
    console.log('Message not found.');
  }

  const payload = { appID: req.body.appID, appSecret: req.body.appSecret, username: req.body.username, password:req.body.password };
  const token = jwt.sign(payload, process.env.JWT_SECRET);



  const redditAccount = new twitterModel({
    token: token, 
    platform: "REDDIT",
    brand:req.body.brand
  });

  redditAccount.save()
}


export async function getAccount(brand){
  let account
  if(brand){
     account = await twitterModel.findOne({platform:"REDDIT", brand:brand})
  }else{
     account = await twitterModel.findOne({platform:"REDDIT",})
  }
  console.log("account", account)
  return  jwt.verify(account.token, process.env.JWT_SECRET);
}







// Get the access token
async function getAccessToken(clientId,clientSecret,username,password) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const tokenUrl = 'https://www.reddit.com/api/v1/access_token';
  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'password',
        username: username,
        password: password,
      }),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    if (response.data && response.data.access_token) {
      console.log('Token fetched successfully:', response.data.access_token);
      return response.data.access_token;  // Return the token
    } else {
      console.error('Token response does not contain access_token:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    return null;
  }
}




export async function getsnoowrap(clientId,clientSecret,username,password) {
  const r = new snoowrap({

    userAgent:userAgent,
      clientId: clientId,
      clientSecret: clientSecret,
      username: username,
      password: password
    });

    return r
  }




export const CreateRedditPost = async (r, title, text, img_url, sr) => {
  try{
     const m = await r.getSubreddit(sr)
      .submitLink({
            title: title,
            text:text,
            url: img_url
          });
      return m
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
    brand
    ) => {
    const newMessage = new SocialMediaPosts({
      post_id: post_id,
      group_name: group_name,
      group_id: String(group_id), 
      timestamp: timestamp,
      platform: "REDDIT",
      brand:brand
    });
    
    await newMessage.save();
    }  








export async function getSubredditSubs(r, subredditName) {
  const sub = await r.getSubreddit(subredditName);
    
  // Access the subscribers property
  const subscribers = await sub.subscribers;
  
  console.log(`The subreddit "${subredditName}" has ${subscribers} subscribers.`);
  
  return subscribers; // Return the number of subscribers if needed
}




export const AddSubreddit = async (
  group_name,
  link,
  group_id,
  subscribers,
  niche,
  brand,
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
          platform:"REDDIT",
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
r,
messageId
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
 

return response.data;

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