import { socialMediaModel } from "../../Model/SocialMedia/SocialMedia.model";
import twitterModel from "../../Model/SocialMedia/TwitterData.model";

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
}