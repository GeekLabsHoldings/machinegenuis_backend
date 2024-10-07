import { subscribe } from "diagnostics_channel";
import * as RedditServices from "../../Service/SocialMedia/reddit.Service";
import { createSocialAccountAddPost } from "../../Service/SocialMedia/socialMedia.service";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";
import redditQueueAddJob from "../../Utils/CronJobs/RedisQueue/reddit.social";
import axios from "axios";
import { getAccount, getBrands } from "../../Service/Operations/BrandCreation.service";

const cron = require("node-cron");



export async function add_subreddit(req, res) {
  try {
    const { group_name, link, group_id, niche, brand, platform, engagement } =
      req.body;

    const acount = await getAccount(req.body.brand, "REDDIT");
    const account = acount.account
    const r = await RedditServices.getsnoowrap(
      account.appID,
      account.appSecret,
      account.username,
      account.password,
    );

    const subscribers = await RedditServices.getSubredditSubs(
      r,
      group_name,
    );

    const newGroup = await RedditServices.AddSubreddit(
      group_name,
      link,
      group_id,
      subscribers,
      niche,
      brand,
      engagement,
    );

    const savedGroup = await newGroup.save();
    res.status(200).json({ savedGroup }); // Respond with the saved group
  } catch (error) {
    console.error("Error adding group:", error);
    return systemError.sendError(res, error);
  }
}

export async function get_subreddits(req, res) {
  try {
    const groups = await RedditServices.getSubreddits();

    res.status(200).json({ groups }); // Respond with all the groups
  } catch (error) {
    console.log(error);
    return systemError.sendError(res, error);
  }
}

export async function get_subreddits_brand(req, res) {
  try {
    const groups = await RedditServices.getSubredditsByBrand(req.params.id);

    res.json({ groups });
  } catch (error) {
    console.log(error);
    return systemError.sendError(res, error);
  }
}

export const BrandRedditSubs = async (req, res) => {
  try {
    const brands = await getBrands(0, 99999999999999)
    const output = []
    for(const brand of brands){
      const subs = await RedditServices.GetSubCount(brand._id);
      output.push({id:brand._id, name:brand.name, description:brand.description, date:brand.aquisition_date, niche:brand.niche, subscribers:subs, engagement:96})
    }
    res.json(output);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};

function delay_(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const CampaignBroadcast = async (req, res) => {
  try {
    let { title, text, url, delay, starttime } = req.body;
    const groups = await RedditServices.getSubreddits();
    delay = Math.max(delay, 10000);
    starttime = starttime - Date.now();
    if (starttime<=0)
      starttime = 1000

    const imgurUrlPattern =
      /^https:\/\/imgur\.com(\/[a-zA-Z0-9-_\/]*)?(#\/[a-zA-Z0-9-_\/]*)?$/;

    if (url && !imgurUrlPattern.test(url)) {
      return res.status(400).json({
        message: "Invalid Imgur URL  make sure no file extension at the end",
      });
    }


    redditQueueAddJob({groups, delay, title, text, url}, starttime);


    res.json({ message: "done" });
  } catch (error) {
    console.log(error);
  }
};

export const CampaignByBrand = async (req,res) => {
  try {

    let { title, text, url, delay, starttime } = req.body;
    const groups = await RedditServices.getSubredditsByBrand(req.params.id);
    delay = Math.max(delay, 10000);
    starttime = starttime - Date.now();
    if (starttime<=0)
      starttime = 1000

    const imgurUrlPattern =
    /^https:\/\/imgur\.com(\/[a-zA-Z0-9-_\/]*)?(#\/[a-zA-Z0-9-_\/]*)?$/;

    if (url && !imgurUrlPattern.test(url)) {
      return res.status(400).json({
        message: "Invalid Imgur URL  make sure no file extension at the end",
      });
    }


    redditQueueAddJob({groups, delay, title, text, url}, starttime);
    
    res.json({ message: "done" });
  } catch (error) {
    console.log(error);
  }
};

export const DeletePost = async (req, ) => {
  try {
    const acount = await getAccount(req.body.brand,"REDDIT");
    const account = acount.account
    const r = await RedditServices.getsnoowrap(
      account.appID,
      account.appSecret,
      account.username,
      account.password
    );

    const m = await RedditServices.DeleteRedditPost(r, req.body.messageId);
    res.json({ message: "done", m: m });
  } catch (error) {
    console.log(error);
  }
};

//====================================

try {
  cron.schedule("0 */6 * * *", async () => {


    const groups = await RedditServices.getSubreddits();
    groups.forEach(async (group) => {
      try {
        const acount = await getAccount(req.body.brand,"REDDIT");
        const account = acount.account
        
        const r = await RedditServices.getsnoowrap(

          acount.appID,
          acount.appSecret,
          acount.username,
          acount.password
        );
        group.subscribers = await RedditServices.getSubredditSubs(
          r,
          group.group_name
        );
        group.save();
      } catch (error) {
        
      }
     
    });
  });
} catch (error) { console.log(error);
}

//===================================
