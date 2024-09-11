import { TwitterApi } from "twitter-api-v2";
import { socialMediaModel } from "../../Model/SocialMedia/SocialMedia.model";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import twitterModel from "../../Model/SocialMedia/TwitterData.model";
import { TwitterSocialMedia } from "../../Service/SocialMedia/twitter.api";
import systemError from "../../Utils/Error/SystemError";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";
import {
  createAccountSocialMedia,
  createSocialMediaPostTwitter,
  createTwitterAccountSecret,
  getTwitterData,
} from "../../Service/SocialMedia/socialMedia.service";

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
      mediaId
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

    const { brand, appKey, appSecret, accessToken, accessSecret } = req.body;

    const encryptedAppKey = encrypt(appKey);
    const encryptedAppSecret = encrypt(appSecret);
    const encryptedAccessToken = encrypt(accessToken);
    const encryptedAccessSecret = encrypt(accessSecret);

    const token = jwt.sign(
      {
        appKey: encryptedAppKey,
        appSecret: encryptedAppSecret,
        accessToken: encryptedAccessToken,
        accessSecret: encryptedAccessSecret,
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
