import { Router } from "express";
import * as redditController from "../../Controller/SocialMedia/socialMedia.reddit.controller";
const redditRouter = Router();
// redditRouter.post("/add-post",redditController.addPostSocialMediaRedditText)



redditRouter.get("/brand-subs/",redditController.BrandRedditSubs)
redditRouter.post("/add-subreddit",redditController.add_subreddit)
redditRouter.post("/campaign-broadcast",redditController.CampaignBroadcast)
redditRouter.post("/campaign-brand/:id",redditController.CampaignByBrand)
redditRouter.post("/delete-post",redditController.DeletePost)
redditRouter.get("/subreddits",redditController.get_subreddits)
redditRouter.get("/subreddits-brand/:id",redditController.get_subreddits_brand)




export default redditRouter;