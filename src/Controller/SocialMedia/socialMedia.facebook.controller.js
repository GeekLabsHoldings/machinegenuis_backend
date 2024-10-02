import S3_services from "../../Service/AWS/S3_Bucket/presinedURL";
import { postPhotoToFacebook, textPhotoToFacebook } from "../../Service/SocialMedia/facebook.service";
import { submitRedditPost } from "../../Service/SocialMedia/reddit.Service";
import { createSocialAccountAddPost } from "../../Service/SocialMedia/socialMedia.service";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";
import { error } from "console";
require("dotenv").config();

export const getPreSignedURL = async (req, res) => {
  try {
    const regionAWS = process.env.AWS_REGION;
    const bucketName = process.env.BUCKET_NAME;
    const fileName = `SocialMedia/Post_${Date.now()}`;
    const s3Serv = new S3_services();
    const preSignedURL = await s3Serv.createPresignedUrlWithClient({
      region: regionAWS,
      bucket: bucketName,
      key: fileName,
    });

    return res.status(200).json({
      message: "The URL created Suc.",
      preSignedURL,
      movieUrl: preSignedURL.split("?")[0],
      s3BucketURL: `s3://machine-genius/${fileName}`,
    });
  } catch (Error) {
    console.log(Error);

    return res.status(500).json({ message: "Error cannot set presigned URL " });
  }
};

export const addPostSocialMediaFacebookText = async (req, res, next) => {
  const { brand, content, token } = req.body;
  const userId = req.body.currentUser._id;
  if ((!content || !brand, !token)) {
    return systemError
      .setStatus(400)
      .setMessage(ErrorMessages.DATA_IS_REQUIRED)
      .throw();
  }
  try {
    const response = await textPhotoToFacebook({
      accessToken: token,
      message: content,
    });
    if (response?.message?.startsWith('Error')) {
        return res.json({message:response.message});
      }
    if (!response) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.INVALID_REDDIT_API)
        .throw();
    }
    const postId = response.id;
    const createPost = await createSocialAccountAddPost(
      PlatformEnum.REDDIT,
      brand,
      content,
      userId,
      postId
    );
    if (!createPost) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.CAN_NOT_CREATE_REDDIT_POST)
        .throw();
    }
    return res.status(200).json({
      result: createPost,
      facebookPost: response,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addPostSocialMediaFacebookPhoto = async (req, res, next) => {
  const { brand, content, token, url } = req.body;
  const userId = req.body.currentUser._id;
  if ((!content || !brand, !token, !url)) {
    return systemError
      .setStatus(400)
      .setMessage(ErrorMessages.DATA_IS_REQUIRED)
      .throw();
  }
  try {
    const response = await postPhotoToFacebook({
      accessToken: token,
      message: content,
      imageUrl:url
    });
    if (response?.message?.startsWith('Error')) {
        return res.json({message:response.message});
      }
    if (!response) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.INVALID_REDDIT_API)
        .throw();
    }
    const postId = response.id;
    const createPost = await createSocialAccountAddPost(
      PlatformEnum.FACEBOOK,
      brand,
      content,
      userId,
      postId
    );
    if (!createPost) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.CAN_NOT_CREATE_REDDIT_POST)
        .throw();
    }
    return res.status(200).json({
      result: createPost,
      facebookPost: response,
    });
  } catch (error) {
    console.log(error);
  }
};
