import * as RedditServices from "../../Service/SocialMedia/reddit.Service";
import { createAccountSocialMedia } from "../../Service/SocialMedia/socialMedia.service";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";

export const addPostSocialMediaRedditText = async (req, res, next) => {
  const { brand, content, title, token } = req.body;
  const userId = req.body.currentUser._id;
  if ((!content || !brand, !title, !token)) {
    return systemError
      .setStatus(400)
      .setMessage(ErrorMessages.DATA_IS_REQUIRED)
      .throw();
  }
  try {
    const response = await submitRedditPost({
      title,
      token,
      subreddit: brand,
      text: content,
    });
    if (!response) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.INVALID_REDDIT_API)
        .throw();
    }
    const postId = response.json.data.id;
    const createPost = await createAccountSocialMedia(
      PlatformEnum.REDDIT,
      brand,
      content,
      userId,
      postId
    );
    if (!createPost) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.CAN_NOT_CREATE_REDDIT_POST)
        .throw();
    }
    return res.status(200).json({
      result: createPost,
      redditPost: response,
    });
  } catch (error) {
    console.log(error);
  }
};


//======================================
//======================================
//======================================


export async function add_subreddit(req, res) {
  try {
    const {token, group_name, link, group_id, niche, brand, platform, engagement } = req.body;
    const subscribers = await RedditServices.getSubredditSubs(token, group_name);

    const newGroup = await RedditServices.AddSubreddit(
      group_name,
      link,
      group_id,
      subscribers,
      niche,
      brand,
      platform,
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
    const groups = await RedditServices.getSubreddits();
    res.status(200).json({ channels: groups }); // Respond with all the groups
  } catch (error) {
    console.error("Error fetching groups:", error);
    return systemError.sendError(res, error);
  }
}

export async function get_subreddits_brand(req, res) {
  try {
    const channels = await RedditServices.getSubredditsByBrand(req.body.brand);
    res.json(channels);
  } catch (error) {
    return systemError.sendError(res, error);
  }
}



export const BrandRedditSubs = async (res, req) => {
  try {
    return await RedditServices.GetSubCount(req.body.brand)
  } catch (error) {
    return systemError.sendError(res, error);
  }
}



function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export const CampaignBroadcast = async (res, req) =>{
  const {token, title, text, img_url, subreddit, ms} = res.body
  try {
    const groups = await RedditServices.getSubreddits();
    groups.forEach(async (group)=>{
      const m = await RedditServices.CreateRedditPost(token, title, text, img_url, subreddit)
      await RedditServices.AddRedditPostDB(m.data.json.data.id, group.group_name, group.group_id, Date.now())
      delay(ms)
    })
  } catch (error) {
    return systemError.sendError(res, error);
  }

}

export const CampaignByBrand = async (res, req) =>{
 
 const {token, title, text, img_url, subreddit, brand, ms} = res.body
 try {
  const groups = await RedditServices.getSubredditsByBrand(brand)
   groups.forEach(async (group)=>{
     const m = await RedditServices.CreateRedditPost(token, title, text, img_url, subreddit)
     await RedditServices.AddRedditPostDB(m.data.json.data.id, group.group_name, group.group_id, Date.now())
     delay(ms)
   })
 } catch (error) {
   return systemError.sendError(res, error);
 }
}

export const DeletePost = async (res, req) => {
  const {accessToken,group_name,messageId} = req.body
  try {
    return await RedditServices.DeleteRedditPost(accessToken,group_name,messageId)
  } catch (error) {
    return systemError.sendError(res, error);
  }
}