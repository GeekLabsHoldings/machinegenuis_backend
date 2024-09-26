import promptsModel from "../../Model/ContentCreation/Prompts/prompts_model";
import { socialMediaModel } from "../../Model/SocialMedia/SocialMedia.model";
import socialAccountModel from "../../Model/SocialMedia/SocialMediaAccount.model";
import socialCommentModel from "../../Model/SocialMedia/Twitter.SocialMedia.tweets.model";
import twitterModel from "../../Model/SocialMedia/TwitterData.model";
import { campaignListEnum } from "../../Utils/SocialMedia/campaign";

export const createAccountTwitter = async (
  platform,
  brand,
  content,
  userId,
  postId
) => {
  try {
    console.log({ platform, brand, content, userId, postId });
    const createPost = await socialMediaModel.create({
      platform,
      brand,
      content,
      employeeId: userId,
      postId,
    });
    console.log({ createPost });
    return createPost;
  } catch (error) {
    console.log("=============", { error });
  }
};
export const createTwitterAccountSecret = async (brand, token) => {
  await twitterModel.create({
    brand,
    token,
  });
};
export const existAccount = async (accountName) => {
  const Exist = await socialAccountModel.findOne({
    accountName,
  });
  return Exist;
};
export const getTwitterAccount = async (_id) => {
  const twitterAccount = await socialAccountModel.findById(_id);
  return twitterAccount;
};
export const deleteAccountTwitter = async (_id) => {
  const twitterAccount = await socialAccountModel.deleteOne({ _id });
  return twitterAccount;
};
export const getAllTweetsMustApprove = async () => {
  const twitters = await socialCommentModel.find({
    campaignType: campaignListEnum.MUST_APPROVE,
  });
  return twitters;
};
export const getTweetById = async (_id) => {
  const twitterComment = await socialCommentModel.findById(_id);
  return twitterComment;
};
// export const getPromptWithPlatform = async (platform) => {
//   const twitterPrompt = await promptsModel.find({
//     service: platform,
//   });
//   return twitterPrompt;
// };
// export const getAndUpdateTweetComment = async (_id, tweetId, comment) => {
//   const twitterComment = await socialCommentModel.findOneAndUpdate(
//     { _id, tweetId },
//     {
//       comment,
//     },
//     {
//       new: true,
//     }
//   );
//   return twitterComment;
// };
