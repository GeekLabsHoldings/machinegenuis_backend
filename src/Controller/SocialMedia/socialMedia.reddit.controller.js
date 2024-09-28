import { subscribe } from "diagnostics_channel";
import * as RedditServices from "../../Service/SocialMedia/reddit.Service";
import { createAccountSocialMedia } from "../../Service/SocialMedia/socialMedia.service";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";
const cron = require('node-cron');


export async function AddAnAccount(req , res){
try {
  await RedditServices.saveAccount(req, res)
  res.json({message:"done"})
} catch (error) {
  console.error("Error adding group:", error);
  return systemError.sendError(res, error);
}
}


export async function add_subreddit(req, res) {
  try {
    const {group_name, link, group_id, niche, brand, platform, engagement } = req.body;
    console.log("group  name \n" , group_name)

    const acount = await RedditServices.getAccount(null, res);
    const r = await RedditServices.getsnoowrap(acount.appID, acount.appSecret, acount.username, acount.password, res);

    const subscribers = await RedditServices.getSubredditSubs(r, group_name, res);

    const newGroup = await RedditServices.AddSubreddit(
      group_name,
      link,
      group_id,
      subscribers,
      niche,
      brand,
      engagement, res
    );

    const savedGroup = await newGroup.save();
    res.status(200).json({savedGroup}); // Respond with the saved group
  } catch (error) {
    console.error("Error adding group:", error);
    return systemError.sendError(res, error);
  }
}



export async function get_subreddits(req, res) {
  try {

    const groups = await RedditServices.getSubreddits();

    res.status(200).json({groups }); // Respond with all the groups
  } catch (error) {
    console.log(error)
    return systemError.sendError(res, error);
  }
}



export async function get_subreddits_brand(req, res) {
  try {
    const groups = await RedditServices.getSubredditsByBrand(req.body.brand);

    res.json({groups});
  } catch (error) {
    console.log(error)
    return systemError.sendError(res, error);
  }
}



export const BrandRedditSubs = async (req, res) => {
  try {
    
    const subs = await RedditServices.GetSubCount(req.body.brand)
    console.log(subs)
    res.json({subscribers:subs})
  } catch (error) {
    return systemError.sendError(res, error);
  }
}



function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




export const CampaignBroadcast = async (req, res) =>{
  
  try {

    let {title, text, url, ms,  minute, hour, timezone} = req.body
    const cronSchedule = RedditServices.cronSchedule(hour, minute, timezone)
    const groups = await RedditServices.getSubreddits();

    ms = Math.max(ms,  10000)


    const imgurUrlPattern =  /^https:\/\/imgur\.com(\/[a-zA-Z0-9-_\/]*)?(#\/[a-zA-Z0-9-_\/]*)?$/;

    if (! imgurUrlPattern.test(url)) {
       return res.status(400).json({ message: 'Invalid Imgur URL  make sure no file extension at the end' });
    } 

    const task = cron.schedule(cronSchedule, () => {

      groups.forEach(async (group)=>{
    
        const acount = await RedditServices.getAccount(group.brand, res);
        const r = await RedditServices.getsnoowrap(acount.appID, acount.appSecret, acount.username, acount.password, res);
        const m = await RedditServices.CreateRedditPost(r, title, text, url,  group.group_id, res)
        console.log("reddit post \n", m)
        await RedditServices.AddRedditPostDB(m.name, group.group_name, group.group_id, Date.now(), group.brand, res)
        
        delay(ms)
      })
      // Stop the task after it runs
      task.stop();
    });

    res.json({message: "done", })
  } catch (error) {
    console.log(error)
    return systemError.sendError(res, error);
   }

}



export const CampaignByBrand = async (req, res) =>{
 
 
 try {
  let {title, text, url, brand, ms, minute, hour, timezone} = req.body
  const cronSchedule = RedditServices.cronSchedule(hour, minute, timezone)
  const groups = await RedditServices.getSubredditsByBrand(brand)
    
  const acount = await RedditServices.getAccount(brand, res);
  const r = await RedditServices.getsnoowrap(acount.appID, acount.appSecret, acount.username, acount.password, res);


  ms = Math.max(ms,  10000)


  const task = cron.schedule(cronSchedule, () => {
      groups.forEach(async (group)=>{

        const m = await RedditServices.CreateRedditPost(r, title, text, url,  group.group_id, res)
        console.log("reddit post \n", m)
        await RedditServices.AddRedditPostDB(m.name, group.group_name, group.group_id, Date.now(), group.brand, res)
        
        delay(ms)
      })
      // Stop the task after it runs
      task.stop();
  });
  res.json({message: "done", })
 } catch (error) {
   console.log(error)
   return systemError.sendError(res, error);
 }
}



export const DeletePost = async (req, res) => {
  try {
    const acount = await RedditServices.getAccount(req.body.brand);
    const r = await RedditServices.getsnoowrap(acount.appID, acount.appSecret, acount.username, acount.password);

    const m = await RedditServices.DeleteRedditPost(r, req.body.messageId)
    res.json({message: "done", m: m})
  } catch (error) {
    console.log(error)
    return systemError.sendError(res, error);
  }
}



//====================================


try {
  cron.schedule('0 */6 * * *', async () => {
    const r = await RedditServices.getsnoowrap(acount.appID, acount.appSecret, acount.username, acount.password);
    const groups = await RedditServices.getSubreddits();
    groups.forEach(async(group)=>{
      group.subscribers = await RedditServices.getSubredditSubs(r, group.group_name)
      group.save()
    })
  });
} catch (error) {
  
}

//===================================


