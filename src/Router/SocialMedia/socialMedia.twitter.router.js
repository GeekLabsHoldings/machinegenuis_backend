import { Router } from "express";
import * as socialMediaController from "../../Controller/SocialMedia/socialMedia.twitter.controller";

const twitterRouter = Router();
twitterRouter.post("/add-post", socialMediaController.addPostSocialMediaTwitter);
twitterRouter.post("/add-new-account", socialMediaController.addNewAccountTwitter);
twitterRouter.post("/get-account-data", socialMediaController.getTwitterAccountSecretData);
export default twitterRouter;
