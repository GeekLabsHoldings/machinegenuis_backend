import { TwitterApi } from "twitter-api-v2";
import { socialMediaModel } from "../../Model/SocialMedia/SocialMedia.model";

import crypto from "crypto";
import jwt from "jsonwebtoken";
import twitterModel from "../../Model/SocialMedia/TwitterData.model";
export const addPostSocialMedia = async (req, res) => {
  try {
    const { platform, brand, content } = req.body;
    const userId = req.body.currentUser._id;
    if (!platform || !brand || !content) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }
    const createPost = await socialMediaModel.create({
      platform,
      brand,
      content,
      employeeId: userId,
    });
    return res.status(200).json({
      message: "Post created successfully",
      createPost,
    });
  } catch (error) {
    console.log(error);
  }
};

export const encryptSensitiveData = async (req, res) => {
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
      process.env.JWT_SECRET_TWITTER
    );
    await twitterModel.create({
      brand,
      token,
    });

    return res.json({ message: "Done" });
  } catch (error) {
    console.error("Error encrypting data:", error);
    res
      .status(500)
      .json({ message: "Error encrypting data", error: error.message });
  }
};
