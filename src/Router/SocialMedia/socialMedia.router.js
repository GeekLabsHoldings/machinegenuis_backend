import { Router } from "express";
import * as socialMediaController from "../../Controller/SocialMedia/socialMedia.controller";

const twitterRouter = Router();
twitterRouter.post("/add-post", socialMediaController.addPostSocialMediaTwitter);
twitterRouter.post("/add-new-account", socialMediaController.addNewAccountTwitter);

export default twitterRouter;
