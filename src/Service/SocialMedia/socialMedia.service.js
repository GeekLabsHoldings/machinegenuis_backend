import { platform } from "os";
import { socialMediaModel } from "../../Model/SocialMedia/SocialMedia.model";
import socialAccountModel from "../../Model/SocialMedia/SocialMediaAccount.model";
export const createSocialAccountAddPost = async (
  platform,
  brandId,
  content,
  userId,
  postId
) => {
  try {
    const createPost = await socialMediaModel.create({
      platform,
      brandId,
      content,
      employeeId: userId,
      postId,
    });
    return createPost;
  } catch (error) {
    console.log("=============", { error });
  }
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
  longPauseAfterCount,
  niche
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
    longPauseAfterCount,
    niche,
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
