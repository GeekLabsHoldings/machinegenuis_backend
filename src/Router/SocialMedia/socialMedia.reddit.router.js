import { Router } from "express";
import * as redditController from "../../Controller/SocialMedia/socialMedia.reddit.controller";
const redditRouter = Router();
redditRouter.post("/add-post",redditController.addPostSocialMediaRedditText)

export default redditRouter;