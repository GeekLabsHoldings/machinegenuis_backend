import { socialMediaModel } from "../../Model/SocialMedia/SocialMedia.model";
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