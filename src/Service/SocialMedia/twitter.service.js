import { socialMediaModel } from "../../Model/SocialMedia/SocialMedia.model";
import socialAccountModel from "../../Model/SocialMedia/SocialMediaAccount.model";
import twitterModel from "../../Model/SocialMedia/TwitterData.model";

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
export const getTwitterAccounts = async (sharingList) => {
  const twitterAccounts = await socialAccountModel.find({
    sharingList,
  });
  return twitterAccounts;
};
