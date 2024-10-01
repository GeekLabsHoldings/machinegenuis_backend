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
twitterRouter.get(
  "/get-tweets-mustApprove",
  socialMediaController.getTweetsMustApprove
);
twitterRouter.post(
  "/generate-new-reply",
  socialMediaController.generateNewReply
);
twitterRouter.post(
  "/add-reply-to-tweet/:_id",
  socialMediaController.addReplyToTweet
);
twitterRouter.post(
  "/generate-hashtags",
  socialMediaController.generateHashtags
);

export default twitterRouter;
