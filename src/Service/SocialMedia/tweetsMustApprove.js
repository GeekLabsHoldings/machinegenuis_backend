// import BrandsModel from "../../Models/Brands/BrandCreation.model";
// import promptsModel from "../../Models/socialMedia/openAi.prompt.model";
// import socialAccountModel from "../../Models/socialMedia/SocialMediaAccount.model";
// import socialCommentModel from "../../Models/socialMedia/Twitter.SocialMedia.tweets.model";
// import { campaignListEnum } from "../../utils/campaign/index.ts";
import promptsModel from "../../Model/ContentCreation/Prompts/prompts_model";
import BrandsModel from "../../Model/Operations/BrandCreation.model";
import socialAccountModel from "../../Model/SocialMedia/SocialMediaAccount.model";
import socialCommentModel from "../../Model/SocialMedia/Twitter.SocialMedia.tweets.model";
import { campaignListEnum } from "../../Utils/SocialMedia/campaign";


export const convertToMilliseconds = (timeString) => {
  const timeValue = parseInt(timeString); 
  return timeValue * 60 * 1000; 
};
export const getTwitterAccounts = async () => {
  const accounts = await socialAccountModel.find({
    sharingList: "TWITTER",
  });
  return accounts;
};
export const checkReplyTweet = async (tweetId) => {
  const checkReply = await socialCommentModel.findOne({
    post_id: tweetId,
  });
  return checkReply;
};
export const createReply = async (
  platform,
  accountName,
  brand,
  reply,
  post_id,
  campaignType,
  content,
) => {
  if (campaignType === campaignListEnum.AUTO_COMMENT) {
    const socialComment = await socialCommentModel.create({
      platform,
      accountName,
      brand,
      comment: reply,
      post_id,
      campaignType: campaignListEnum.AUTO_COMMENT,
    });
    return socialComment;
  } else {
    const socialContent = await socialCommentModel.create({
      platform,
      accountName,
      brand,
      comment: reply,
      post_id,
      content,
      campaignType: campaignListEnum.MUST_APPROVE,
    });
    return socialContent;
  }
};
export const getPrompt = async (service) => {
  const prompt = await promptsModel.findOne({ service });
  return prompt;
};
export const getAllBrands = async () => {
  const brands = await BrandsModel.find({});
  return brands;
};
export const getAllAccounts = async (brand) => {
  const accounts = await socialAccountModel.find({ brand ,status: 'Running'});
  return accounts;
};
