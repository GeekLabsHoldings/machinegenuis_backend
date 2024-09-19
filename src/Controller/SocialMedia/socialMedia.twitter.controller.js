import { TwitterApi } from "twitter-api-v2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  getUserByUsername,
  TwitterSocialMedia,
} from "../../Service/SocialMedia/twitter.api";
import systemError from "../../Utils/Error/SystemError";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";
import {
  createAccountSocialMedia,
  createSocialAccount,
  createSocialMediaPostTwitter,
  createTwitterAccountSecret,
  getTwitterData,
} from "../../Service/SocialMedia/socialMedia.service";
import {
  deleteAccountTwitter,
  existAccount,
  getTwitterAccount,
  getTwitterAccounts,
} from "../../Service/SocialMedia/twitter.service";
import socialAccountModel from "../../Model/SocialMedia/SocialMediaAccount.model";
import { log } from "console";
import exp from "constants";

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

    const checkBrand = await getTwitterData(brand);
    if (checkBrand) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.BRAND_EXIST)
        .throw();
    }
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
    res
      .status(500)
      .json({ message: "Error encrypting data", error: error.message });
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
    } = req.body;
    const employeeId = req.body.currentUser._id;
    if (
      !sharingList ||
      !brand ||
      !accountName ||
      !userName ||
      !accountLink ||
      !campaignType
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
      employeeId
    );
    return res.status(200).json({ result: socialAccount });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Account name already exists" });
    }
    console.log(error);
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
    await twitterAccount.save();
    return res.status(200).json({ result: twitterAccount });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Account name already exists" });
    }
    console.log(error);
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
    console.log(error);
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
export const getAllAccountTwitter = async (req, res) => {
  try {
    const twitterAccounts = await getTwitterAccounts(req.params.sharingList);
    return res.status(200).json({ result: twitterAccounts });
  } catch (error) {
    console.log(error);
  }
};
