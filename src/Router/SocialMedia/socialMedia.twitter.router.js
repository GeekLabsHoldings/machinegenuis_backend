import { Router } from "express";
import * as socialMediaController from "../../Controller/SocialMedia/socialMedia.twitter.controller";

const twitterRouter = Router();
twitterRouter.post(
  "/add-account",
  socialMediaController.addSocialAccountTwitter
);
twitterRouter.put(
  "/edit-account/:_id",
  socialMediaController.editTwitterAccount
);
twitterRouter.patch(
  "/edit-account/campaign/:_id",
  socialMediaController.editCampaignTwitterAccount
);
twitterRouter.delete(
  "/delete-account/:_id",
  socialMediaController.deleteTwitterAccount
);
twitterRouter.get(
  "/get-account-data/:sharingList",
  socialMediaController.getAllAccountTwitter
);
twitterRouter.post(
  "/add-post",
  socialMediaController.addPostSocialMediaTwitter
);
twitterRouter.post(
  "/add-new-account",
  socialMediaController.addNewAccountTwitter
);
twitterRouter.post(
  "/get-account-data",
  socialMediaController.getTwitterAccountSecretData
);
export default twitterRouter;
