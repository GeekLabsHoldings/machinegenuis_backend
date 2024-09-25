import { subscribe } from "diagnostics_channel";
import * as RedditServices from "../../Service/SocialMedia/reddit.Service";
import { createAccountSocialMedia } from "../../Service/SocialMedia/socialMedia.service";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";
const cron = require('node-cron');


export async function AddAnAccount(req , res){
try {
  await RedditServices.saveAccount(req)
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

    const acount = await RedditServices.getAccount(null);
    const r = await RedditServices.getsnoowrap(acount.appID, acount.appSecret, acount.username, acount.password);

    const subscribers = await RedditServices.getSubredditSubs(r, group_name);

    const newGroup = await RedditServices.AddSubreddit(
      group_name,
      link,
      group_id,
      subscribers,
      niche,
      brand,
      engagement
    );

    const savedGroup = await newGroup.save();
    res.status(200).json(savedGroup); // Respond with the saved group
  } catch (error) {
    console.error("Error adding group:", error);
    return systemError.sendError(res, error);
  }
}



export async function get_subreddits(req, res) {
  try {
    const acount = await RedditServices.getAccount(null);
    const r = await RedditServices.getsnoowrap(acount.appID, acount.appSecret, acount.username, acount.password);

    const groups = await RedditServices.getSubreddits();
    groups.forEach(async(group)=>{
      group.subscribers = await RedditServices.getSubredditSubs(r, group.group_name)
      group.save()
    })
    res.status(200).json({groups }); // Respond with all the groups
  } catch (error) {
    console.log(error)
    return systemError.sendError(res, error);
  }
}



export async function get_subreddits_brand(req, res) {
  try {
    const acount = await RedditServices.getAccount(null);
    const r = await RedditServices.getsnoowrap(acount.appID, acount.appSecret, acount.username, acount.password);

    const groups = await RedditServices.getSubredditsByBrand(req.body.brand);
    groups.forEach(async(group)=>{
      group.subscribers = await RedditServices.getSubredditSubs(r, group.group_name)
      group.save()
    })
    res.json(groups);
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
  const {title, text, img_url, ms,  minute, hour} = req.body
  console.log("hi hello hi hello", req.body)
  try {

    const groups = await RedditServices.getSubreddits();
    
    const acount = await RedditServices.getAccount(null);
    const r = await RedditServices.getsnoowrap(acount.appID, acount.appSecret, acount.username, acount.password);


    // Schedule a task to run at 8:15 PM only once
    const task = cron.schedule(`${minute} ${hour} * * *`, () => {

      groups.forEach(async (group)=>{

        const m = await RedditServices.CreateRedditPost(r, title, text, img_url, group.group_id)
        console.log("reddit post \n", m.name)
        await RedditServices.AddRedditPostDB(m.name, group.group_name, group.group_id, Date.now(), group.brand)
        
        delay(ms)
      })
      // Stop the task after it runs
      task.stop();
    });

    res.json({message: "done", })
  } catch (error) {
    return systemError.sendError(res, error);
  }

}



export const CampaignByBrand = async (req, res) =>{
 
 const {title, text, img_url, brand, ms, minute, hour} = req.body
 try {
  const groups = await RedditServices.getSubredditsByBrand(brand)
    
  const acount = await RedditServices.getAccount(brand);
  const r = await RedditServices.getsnoowrap(acount.appID, acount.appSecret, acount.username, acount.password);



      // Schedule a task to run at 8:15 PM only once
    const task = cron.schedule(`${minute} ${hour} * * *`, () => {
      groups.forEach(async (group)=>{

        const m = await RedditServices.CreateRedditPost(r, title, text, img_url,  group.group_id)
        console.log("reddit post \n", m.name)
        await RedditServices.AddRedditPostDB(m.name, group.group_name, group.group_id, Date.now(), group.brand)
        
        delay(ms)
      })
      // Stop the task after it runs
      task.stop();
    });

  res.json({message: "done", })
 } catch (error) {
   return systemError.sendError(res, error);
 }
}



export const DeletePost = async (req, res) => {
  try {
    const acount = await RedditServices.getAccount(null);
    const r = await RedditServices.getsnoowrap(acount.appID, acount.appSecret, acount.username, acount.password);

    return await RedditServices.DeleteRedditPost(r, req.body.messageId)
  } catch (error) {
    return systemError.sendError(res, error);
  }
}