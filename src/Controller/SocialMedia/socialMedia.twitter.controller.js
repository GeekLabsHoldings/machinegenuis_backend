import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  addReply,
  getUserByUsername,
  TwitterSocialMediaAddPost,
} from "../../Service/SocialMedia/twitter.api";
import systemError from "../../Utils/Error/SystemError";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";
import {
  checkAccountBrand,
  createSocialAccountAddPost,
  createSocialAccount,
  createSocialMediaPostTwitter,
} from "../../Service/SocialMedia/socialMedia.service";
import {
  deleteAccountTwitter,
  deleteTweet,
  existAccount,
  getAllAccounts,
  getAllTweetsMustApprove,
  getAndUpdateTweetComment,
  getPromptWithPlatform,
  getTweetById,
  getTwitterAccount,
  getTwitterAccounts,
  uploadImageService
} from "../../Service/SocialMedia/twitter.service";
import moment from "moment-timezone";
import OpenAiService from "../../Service/OpenAi/OpenAiService";
import { campaignListEnum } from "../../Utils/SocialMedia/campaign";
import PromptService from "../../Service/Prompt/PromptService";
import socialCommentModel from "../../Model/SocialMedia/Twitter.SocialMedia.tweets.model";

import {
  checkBrand,
  getAccount,
} from "../../Service/Operations/BrandCreation.service";
import { twitterQueueAdd } from "../../Utils/CronJobs/TweetsQueue/twitterPostQueue";
import { systemPromptEnum } from "../../Utils/Prompt";
import socialAccountModel from "../../Model/SocialMedia/SocialMediaAccount.model";
const Busboy = require('busboy');







export const addPostSocialMediaTwitter = async (req, res) => {
  try {
    const { content, asset, mediaId, startTime } = req.body;
    const { brandId } = req.params;
    const userId = req.body.currentUser._id;
    const brands = await checkBrand(brandId);
    if (!brands) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.BRAND_NOT_FOUND)
        .throw();
    }
    const twitterData = await getAccount(brandId, PlatformEnum.TWITTER);
    if (!twitterData) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.TWITTER_ACCOUNT_NOT_FOUND)
        .throw();
    }
    await twitterQueueAdd(content, mediaId, brandId, userId, startTime);
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const addSocialAccountTwitter = async (req, res) => {
  try {
    const { brand } = req.params;
    const {
      sharingList,
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
    const brands = await checkBrand(brand);
    if (!brands) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.BRAND_NOT_FOUND)
        .throw();
    }
    const checkAccount = await checkAccountBrand(brand, userName);
    if (checkAccount)
      return res.json({ message: "ACCOUNT_ALREADY_EXIST_IN_BRAND" });
    const twitterData = await getAccount(brand, PlatformEnum.TWITTER);
    if (!twitterData) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.BRAND_NOT_FOUND)
        .throw();
    }
    const response = await getUserByUsername(
      userName,
      twitterData.account.BearerToken
    );
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
      longPauseAfterCount,
      brands.niche
    );
    return res.status(200).json({ result: socialAccount });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const editTwitterAccount = async (req, res) => {
  try {
    const { _id, brand } = req.params;
    const twitterAccount = await getTwitterAccount(_id);

    if (!twitterAccount) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.TWITTER_ACCOUNT_NOT_FOUND)
        .throw();
    }
    const {
      accountName,
      sharingList,
      userName,
      accountLink,
      campaignType,
      delayBetweenPosts,
      delayBetweenGroups,
      longPauseAfterCount,
      status,
    } = req.body;

    const brands = await checkBrand(brand);
    if (!brands) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.BRAND_NOT_FOUND)
        .throw();
    }
    if (userName && twitterAccount.userName !== userName) {
      const twitterData = await getAccount(brand, PlatformEnum.TWITTER);
      if (!twitterData) {
        return systemError
          .setStatus(400)
          .setMessage(ErrorMessages.BRAND_NOT_FOUND)
          .throw();
      }
      const response = await getUserByUsername(
        userName,
        twitterData.account.BearerToken
      );
      twitterAccount.account_id = response.data.id;
      twitterAccount.userName = userName;
    }
    twitterAccount.brand = brand || twitterAccount.brand;
    twitterAccount.accountName = accountName || twitterAccount.accountName;
    twitterAccount.accountLink = accountLink || twitterAccount.accountLink;
    twitterAccount.campaignType = campaignType || twitterAccount.campaignType;
    twitterAccount.status = status || twitterAccount.status;
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
export const getAllAccountsTwitter = async (req, res) => {
  try {
    const accounts = await getAllAccounts();
    return res.json({ result: accounts });
  } catch (error) {
    return;
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
  const { _id, brand } = req.params;
  try {
    const { tweetId, reply } = req.body;
    const tweet = await getTweetById(_id);
    if (!tweet) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.ACCOUNT_NOT_FOUND)
        .throw();
    }
    const twitterData = await getAccount(brand, PlatformEnum.TWITTER);
    if (!twitterData) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.BRAND_NOT_FOUND)
        .throw();
    }
    const tweetReply = await addReply(
      twitterData.account.ConsumerKey,
      twitterData.account.ConsumerSecret,
      twitterData.account.AccessToken,
      twitterData.account.TokenSecret,
      reply,
      tweetId
    );
    if (tweetReply.message === "Reply posted successfully") {
      await deleteTweet(_id);
      const account = await socialAccountModel.findOne({
        userName: tweet.accountName,
      });
      account.comments = account.comments + 1;
      await account.save();
    }

    return res.status(200).json({ result: tweetReply });
  } catch (error) {
    console.log(error);

    if (error.statusCode === 403) {
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
export const generatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const openaiService = new OpenAiService();
    const promptService = new PromptService();
    const promptData = await promptService.getPromptData(
      "socialMedia_content",
      null
    );

    const prompt = promptData.prompt.replace("[[1]]", content);

    const result = await openaiService.callOpenAiApi(
      prompt,
      ` ${systemPromptEnum.Array} . You are a representative of Machine Genius, a social media organization focused on multiple fields.`
    );
    const posts = JSON.parse(result.choices[0].message.content);
    return res.status(200).json({ posts });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};




export async function uploadImage(req, res) {
  console.log("this is a req.body for upload image \n\n", req.body);
  
  try {
    console.log("Starting Twitter image upload process");
    console.log("Request Content-Type:", req.headers['content-type']);
    // Check if we have image data
    const image = req.body.image

    const busboy = Busboy({ headers: req.headers });
  
    let fileBuffer = Buffer.alloc(0);
    let rawTwitterData;
    const formData = {};

    // Handle form field data
    busboy.on('field', (fieldname, value) => {
      formData[fieldname] = value;
      rawTwitterData = value // Store the form field and its value
      console.log(`Form field data received: ${fieldname}: ${value}`);
    });
  
    // Handle file upload
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      file.on('data', (data) => {
        // Append incoming file data to the buffer
        fileBuffer = Buffer.concat([fileBuffer, data]);
      });
  
      file.on('end', () => {
        console.log(`File upload complete: ${filename}, size: ${fileBuffer.length}`);
      });
    });
  

    busboy.on('finish', async () => {
      // Process the uploaded file buffer and form data

      console.log("twitter data \n\n", rawTwitterData)

      if (!rawTwitterData || typeof rawTwitterData !== 'string') {
        console.error("Missing or invalid twitterData");
        return res.status(400).json({ error: "Missing or invalid twitterData" });
      }
  
      let twitterData;
      try {
        twitterData = JSON.parse(rawTwitterData);
        console.log("Twitter data parsed successfully");
      } catch (e) {
        console.error("Failed to parse twitterData:", e);
        return res.status(400).json({ error: "twitterData must be a valid JSON string" });
      }
      // Validate Twitter data structure
      if (
        !twitterData.platform ||
        twitterData.platform !== "TWITTER" ||
        !twitterData.account ||
        typeof twitterData.account.ConsumerKey !== "string" ||
        typeof twitterData.account.ConsumerSecret !== "string" ||
        typeof twitterData.account.AccessToken !== "string" ||
        typeof twitterData.account.TokenSecret !== "string" ||
        typeof twitterData.account.BearerToken !== "string"
      ) {
        console.error("Invalid twitterData structure:", JSON.stringify(twitterData));
        return res.status(400).json({ error: "Invalid twitterData structure" });
      }
  
  
  
  
      const twitterResponse = await uploadImageService(twitterData,  fileBuffer.toString('base64'))
  
      return res.status(200).json(twitterResponse);
    });

    req.pipe(busboy);  



   
  } catch (error) {
    console.error("Unhandled error in upload-image API:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
  
