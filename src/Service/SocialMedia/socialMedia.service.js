import { platform } from "os";
import { socialMediaModel } from "../../Model/SocialMedia/SocialMediaPosts.models";
import socialAccountModel from "../../Model/SocialMedia/SocialMediaAccount.model";
import { group } from "console";
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
      group_id:`${Date.now()}_${platform}_POST`,
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
  niche,
  profile_image_url
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
    profile_image_url
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
