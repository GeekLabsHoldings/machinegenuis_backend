import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  addReply,
  getTweets,
  getUserByUsername,
  TwitterSocialMedia,
} from "../../Service/SocialMedia/twitter.api";
import systemError from "../../Utils/Error/SystemError";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";
import {
  checkAccountBrand,
  createAccountSocialMedia,
  createSocialAccount,
  createSocialMediaPostTwitter,
  createTwitterAccountSecret,
  getTwitterData,
} from "../../Service/SocialMedia/socialMedia.service";
import {
  deleteAccountTwitter,
  deleteTweet,
  existAccount,
  getAllTweetsMustApprove,
  getAndUpdateTweetComment,
  getPromptWithPlatform,
  getTweetById,
  getTwitterAccount,
  getTwitterAccounts,
} from "../../Service/SocialMedia/twitter.service";
import moment from "moment-timezone";
import OpenAiService from "../../Service/OpenAi/OpenAiService";
import { campaignListEnum } from "../../Utils/SocialMedia/campaign";
import PromptService from "../../Service/Prompt/PromptService";
import socialCommentModel from "../../Model/SocialMedia/Twitter.SocialMedia.tweets.model";

function decrypt(encryptedText) {
  const algorithm = "aes-256-cbc";
  const secretKeyHex = process.env.SECRET_KEY;
  if (!secretKeyHex) {
    throw new Error("SECRET_KEY environment variable is not set.");
  }
  if (secretKeyHex.length !== 64) {
    throw new Error("SECRET_KEY must be a 64-character hexadecimal string.");
  }
  const secretKey = Buffer.from(secretKeyHex, "hex");
  // Split the encrypted text into IV and the actual encrypted data
  const [ivHex, encryptedData] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
export const addPostSocialMediaTwitter = async (req, res) => {
  try {
    const { brand, content, mediaId } = req.body;
    const userId = req.body.currentUser._id;
    if (!brand || !content) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.DATA_IS_REQUIRED)
        .throw();
    }
    const twitterData = await getTwitterData(brand);
    if (!twitterData) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.BRAND_NOT_FOUND)
        .throw();
    }
    const { token } = twitterData;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const decryptedAppKey = decrypt(decodedToken.appKey);
    const decryptedAppSecret = decrypt(decodedToken.appSecret);
    const decryptedAccessToken = decrypt(decodedToken.accessToken);
    const decryptedAccessSecret = decrypt(decodedToken.accessSecret);
    const response = await TwitterSocialMedia({
      content,
      appKey: decryptedAppKey,
      appSecret: decryptedAppSecret,
      accessToken: decryptedAccessToken,
      accessSecret: decryptedAccessSecret,
      mediaId,
    });
    const createPost = await createAccountSocialMedia(
      PlatformEnum.TWITTER,
      brand,
      content,
      userId,
      response.tweet.data.id
    );
    return res.status(200).json({
      tweet: response,
      result: createPost,
    });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const addNewAccountTwitter = async (req, res) => {
  try {
    const algorithm = "aes-256-cbc";

    // Ensure SECRET_KEY is defined and is a valid 32-byte key
    const secretKeyHex = process.env.SECRET_KEY;
    if (!secretKeyHex) {
      throw new Error("SECRET_KEY environment variable is not set.");
    }
    if (secretKeyHex.length !== 64) {
      throw new Error("SECRET_KEY must be a 64-character hexadecimal string.");
    }

    const secretKey = Buffer.from(secretKeyHex, "hex");

    // Generate a new IV for each encryption
    const iv = crypto.randomBytes(16);

    function encrypt(text) {
      const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");
      // Return IV and encrypted data together
      return iv.toString("hex") + ":" + encrypted;
    }

    const { brand, appKey, appSecret, accessToken, accessSecret, bearerToken } =
      req.body;
    const encryptedAppKey = encrypt(appKey);
    const encryptedAppSecret = encrypt(appSecret);
    const encryptedAccessToken = encrypt(accessToken);
    const encryptedAccessSecret = encrypt(accessSecret);
    const encryptedBearerToken = encrypt(bearerToken);
    const token = jwt.sign(
      {
        appKey: encryptedAppKey,
        appSecret: encryptedAppSecret,
        accessToken: encryptedAccessToken,
        accessSecret: encryptedAccessSecret,
        bearerToken: encryptedBearerToken,
      },
      process.env.JWT_SECRET
    );
    await createTwitterAccountSecret(brand, token);
    return res.json({ message: "Done" });
  } catch (error) {
    console.error("Error encrypting data:", error);
    return systemError.sendError(res, error);
  }
};
export const getTwitterAccountSecretData = async (req, res) => {
  try {
    const { brand } = req.body;

    if (!brand) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.DATA_IS_REQUIRED)
        .throw();
    }
    const twitterData = await getTwitterData(brand);
    if (!twitterData) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.BRAND_NOT_FOUND)
        .throw();
    }
    const { token } = twitterData;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const decryptedAppKey = decrypt(decodedToken.appKey);
    const decryptedAppSecret = decrypt(decodedToken.appSecret);
    const decryptedAccessToken = decrypt(decodedToken.accessToken);
    const decryptedAccessSecret = decrypt(decodedToken.accessSecret);
    const decryptedBearerToken = decrypt(decodedToken.bearerToken);
    return res.status(200).json({
      message: "Success",
      Data: {
        ConsumerKey: decryptedAppKey,
        ConsumerSecret: decryptedAccessSecret,
        AccessToken: decryptedAccessToken,
        TokenSecret: decryptedAccessSecret,
        BearerToken: decryptedBearerToken,
      },
    });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const addSocialAccountTwitter = async (req, res) => {
  try {
    const {
      sharingList,
      brand,
      accountName,
      userName,
      accountLink,
      campaignType,
      delayBetweenPosts,
      delayBetweenGroups,
      longPauseAfterCount,
    } = req.body;
    const employeeId = req.body.currentUser._id;
    if (
      !sharingList ||
      !brand ||
      !accountName ||
      !userName ||
      !accountLink ||
      !campaignType ||
      !delayBetweenPosts ||
      !delayBetweenGroups ||
      !longPauseAfterCount
    ) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.DATA_IS_REQUIRED)
        .throw();
    }
    if (sharingList !== "TWITTER") {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.INVALID_SOCIAL_MEDIA_TYPE)
        .throw();
    }
    const checkAccount = await checkAccountBrand(brand, userName);
    if (checkAccount)
      return res.json({ message: "ACCOUNT_ALREADY_EXIST_IN_BRAND" });
    const twitterData = await getTwitterData(brand);
    if (!twitterData) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.BRAND_NOT_FOUND)
        .throw();
    }
    const { token } = twitterData;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const BearerToken = decrypt(decodedToken.bearerToken);
    const response = await getUserByUsername(userName, BearerToken);
    const account_id = response.data.id;

    const socialAccount = await createSocialAccount(
      PlatformEnum.TWITTER,
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
    );
    return res.status(200).json({ result: socialAccount });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const editTwitterAccount = async (req, res) => {
  try {
    const { _id } = req.params;
    const twitterAccount = await getTwitterAccount(_id);

    if (!twitterAccount) {
      return res.json({ message: "Twitter account not found" });
    }
    const {
      accountName,
      brand,
      sharingList,
      userName,
      accountLink,
      campaignType,
      delayBetweenPosts,
      delayBetweenGroups,
      longPauseAfterCount,
    } = req.body;
    if (userName && twitterAccount.userName !== userName) {
      const twitterData = await getTwitterData(brand);

      if (!twitterData) {
        return systemError
          .setStatus(400)
          .setMessage(ErrorMessages.BRAND_NOT_FOUND)
          .throw();
      }
      const decodedToken = jwt.verify(
        twitterData.token,
        process.env.JWT_SECRET
      );
      const BearerToken = decrypt(decodedToken.bearerToken);
      const response = await getUserByUsername(userName, BearerToken);
      twitterAccount.account_id = response.data.id;
      twitterAccount.userName = userName;
    }
    twitterAccount.brand = brand || twitterAccount.brand;
    twitterAccount.accountName = accountName || twitterAccount.accountName;
    twitterAccount.accountLink = accountLink || twitterAccount.accountLink;
    twitterAccount.campaignType = campaignType || twitterAccount.campaignType;
    twitterAccount.delayBetweenPosts =
      delayBetweenPosts || twitterAccount.delayBetweenPosts;
    twitterAccount.delayBetweenGroups =
      delayBetweenGroups || twitterAccount.delayBetweenGroups;
    twitterAccount.longPauseAfterCount =
      longPauseAfterCount || twitterAccount.longPauseAfterCount;
    await twitterAccount.save();
    return res.status(200).json({ result: twitterAccount });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Account name already exists" });
    }
    return systemError.sendError(res, error);
  }
};
export const editCampaignTwitterAccount = async (req, res) => {
  try {
    const { _id } = req.params;
    const twitterAccount = await getTwitterAccount(_id);
    if (!twitterAccount) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.ACCOUNT_NOT_FOUND)
        .throw();
    }
    twitterAccount.campaignType =
      req.body.campaignType || twitterAccount.campaignType;
    await twitterAccount.save();
    return res.status(200).json({ result: twitterAccount });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Account name already exists" });
    }
    return systemError.sendError(res, error);
  }
};
export const deleteTwitterAccount = async (req, res) => {
  try {
    const { _id } = req.params;
    const twitterAccount = await deleteAccountTwitter(_id);
    if (twitterAccount.deletedCount === 0) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.ACCOUNT_NOT_FOUND)
        .throw();
    }
    return res
      .status(200)
      .json({ message: "Twitter account deleted successfully" });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const getTweetsMustApprove = async (req, res) => {
  try {
    const twitterAccounts = await getAllTweetsMustApprove();
    return res.status(200).json({ result: twitterAccounts });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const generateNewReply = async (req, res) => {
  try {
    const { content, platform } = req.body;
    const openaiService = new OpenAiService();
    const promptService = new PromptService();
    const promptData = await promptService.getPromptData(platform, null);
    const prompt = promptData.prompt.replace("[[1]]", content);
    const result = await openaiService.callOpenAiApi(
      prompt,
      "You are a representative of Machine Genius, a social media organization focused on multiple fields. Provide a brief and relevant comment in response to the input, ensuring clarity and engagement."
    );
    const reply = result.choices[0].message.content;
    return res.status(200).json({ NewComment: reply });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const addReplyToTweet = async (req, res) => {
  const { _id } = req.params;
  try {
    const { brand, tweetId, reply } = req.body;
    const tweet = await getTweetById(_id);
    if (!tweet) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.ACCOUNT_NOT_FOUND)
        .throw();
    }
    const twitterData = await getTwitterData(tweet.brand);
    const { token } = twitterData;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const decryptedAppKey = decrypt(decodedToken.appKey);
    const decryptedAppSecret = decrypt(decodedToken.appSecret);
    const decryptedAccessToken = decrypt(decodedToken.accessToken);
    const decryptedAccessSecret = decrypt(decodedToken.accessSecret);
    const decryptedBearerToken = decrypt(decodedToken.bearerToken);
    const tweetReply = await addReply(
      decryptedAppKey,
      decryptedAppSecret,
      decryptedAccessToken,
      decryptedAccessSecret,
      reply,
      tweetId
    );
    console.log("------->",tweetReply.data.status);
    
    if (tweetReply.message === "Reply posted successfully") {
      await deleteTweet(_id);
    }

    return res.status(200).json({ result: tweetReply });
  } catch (error) {
    console.log(error);
    
    if(error.statusCode === 403){ 
      await deleteTweet(_id);
    return res.status(403).json({ message: "Tweet not found" });
    }
    return systemError.sendError(res, error);
  }
};
export const generateHashtags = async (req, res) => {
  try {
    const { content } = req.body;
    const openaiService = new OpenAiService();
    const promptService = new PromptService();
    const promptData = await promptService.getPromptData(
      "TWITTER_HASHTAGS",
      null
    );
    const prompt = promptData.prompt.replace("[[1]]", content);
    const result = await openaiService.callOpenAiApi(
      prompt,
      "You are a representative of Machine Genius, a social media organization focused on multiple fields. Provide a brief and relevant comment in response to the input, ensuring clarity and engagement."
    );
    const hashTags = result.choices[0].message.content;
    return res.status(200).json({ hashTags });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
