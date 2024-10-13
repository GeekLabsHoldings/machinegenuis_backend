import promptsModel from "../../Model/ContentCreation/Prompts/prompts_model";
import { socialMediaModel } from "../../Model/SocialMedia/SocialMedia.model";
import socialAccountModel from "../../Model/SocialMedia/SocialMediaAccount.model";
import socialCommentModel from "../../Model/SocialMedia/Twitter.SocialMedia.tweets.model";
import { campaignListEnum } from "../../Utils/SocialMedia/campaign";
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

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
  const twitters = await socialCommentModel
    .find({
      campaignType: campaignListEnum.MUST_APPROVE,
    })
    .sort({ createdAt: -1 })
    .populate({
      path: "accountId",
      select: "profile_image_url",
    });
  return twitters;
};
export const getTweetById = async (_id) => {
  const twitterComment = await socialCommentModel.findById(_id);
  return twitterComment;
};
export const deleteTweet = async (_id) => {
  await socialCommentModel.deleteOne({ _id });
};
export const getAllAccounts = async () => {
  const accounts = await socialAccountModel.find({});
  return accounts;
};


export const uploadImageService = async (twitterData, image) => {
  try {
    const { ConsumerKey, ConsumerSecret, AccessToken, TokenSecret } = twitterData.account;
    //const fileBuffer =  Buffer.from(image, 'base64');;
    // Create OAuth object and prepare request
    const oauth = new OAuth({
      consumer: { key: ConsumerKey, secret: ConsumerSecret },
      signature_method: "HMAC-SHA1",
      hash_function(baseString, key) {
        return crypto
          .createHmac("sha1", key)
          .update(baseString)
          .digest("base64");
      },
    });
    const requestData = {
      url: "https://upload.twitter.com/1.1/media/upload.json",
      method: "POST",
      data: {
        media: image,
      },
    };
    const headers = oauth.toHeader(
      oauth.authorize(requestData, { key: AccessToken, secret: TokenSecret })
    );
    console.log("OAuth headers generated");
    const body = new URLSearchParams();
    body.append("media", requestData.data.media);
    console.log("Sending request to Twitter API");
    // Make request to Twitter API
    const response = await fetch(requestData.url, {
      method: requestData.method,
      headers: {
        ...headers,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    console.log("Response received from Twitter API. Status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Twitter upload failed:", errorText);
      return  errorText 
    }
    const twitterResponse = await response.json();
    console.log("Twitter upload successful:", JSON.stringify(twitterResponse));
    return twitterResponse
  } catch (error) {
    console.log(error)
  }
}