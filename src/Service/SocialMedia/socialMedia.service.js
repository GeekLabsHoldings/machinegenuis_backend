import { platform } from "os";
import { socialMediaModel } from "../../Model/SocialMedia/SocialMedia.model";
import twitterModel from "../../Model/SocialMedia/TwitterData.model";
import socialAccountModel from "../../Model/SocialMedia/SocialMediaAccount.model";

export const createAccountSocialMedia = async (
  platform,
  brand,
  content,
  userId,
  postId
) => {
  try {
    const createPost = await socialMediaModel.create({
      platform,
      brand,
      content,
      employeeId: userId,
      postId,
    });
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
export const getTwitterData = async (brand) => {
  const twitterData = await twitterModel.findOne({ brand });
  return twitterData;
};
export const createSocialAccount = async (
  sharingList,
  brand,
  accountName,
  userName,
  accountLink,
  account_id,
  campaignType,
  employeeId,
  delayBetweenPosts,
  delayBetweenGroups,
  longPauseAfterCount
) => {
  const socialAccount = await socialAccountModel.create({
    sharingList,
    brand,
    accountName,
    userName,
    accountLink,
    account_id,
    campaignType,
    employeeId,
    delayBetweenPosts,
    delayBetweenGroups,
    longPauseAfterCount
  });
  return socialAccount;
};
export const checkAccountBrand = async (brand, userName) => {
  const checkAccount = await socialAccountModel.findOne({
    brand,
    userName,
  });
  return checkAccount;
};
