import { Router, raw, json } from "express";
import * as socialMediaController from "../../Controller/SocialMedia/socialMedia.twitter.controller";

const twitterRouter = Router();

twitterRouter.use(json());
twitterRouter.use(raw({ type: 'image/*', limit: '5mb' }));


twitterRouter.post(
  "/add-account/:brand",
  socialMediaController.addSocialAccountTwitter
);
twitterRouter.put(
  "/edit-account/:_id/:brand",
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
  "/add-post/:brandId",
  socialMediaController.addPostSocialMediaTwitter
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
  "/add-reply-to-tweet/:_id/:brand",
  socialMediaController.addReplyToTweet
);
twitterRouter.get(
  "/get-all-accounts",
  socialMediaController.getAllAccountsTwitter
);




twitterRouter.post(
  "/upload-image",
  socialMediaController.uploadImage
);

export default twitterRouter;
