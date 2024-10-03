import S3_services from "../../Service/AWS/S3_Bucket/presinedURL";
import {
  checkBrand,
  getAccount,
} from "../../Service/Operations/BrandCreation.service";
import {
  postPhotoToFacebook,
  textPhotoToFacebook,
} from "../../Service/SocialMedia/facebook.service";
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
  const { brandId } = req.params;
  const { content } = req.body;
  const userId = req.body.currentUser._id;
  if (!content || !brandId) {
    return systemError
      .setStatus(400)
      .setMessage(ErrorMessages.DATA_IS_REQUIRED)
      .throw();
  }
  try {
    const brands = await checkBrand(brandId);
    if (!brands) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.BRAND_NOT_FOUND)
        .throw();
    }
    const facebookData = await getAccount(brandId, PlatformEnum.FACEBOOK);
    const response = await textPhotoToFacebook({
      accessToken: facebookData.account.token,
      FACEBOOK_PAGE_ID: facebookData.account.pageID,
      message: content,
    });
    if (response?.message?.startsWith("Error")) {
      return res.json({ message: response.message });
    }
    if (!response) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.INVALID_FACEBOOK_API)
        .throw();
    }
    const postId = response.id;
    const createPost = await createSocialAccountAddPost(
      PlatformEnum.FACEBOOK,
      brandId,
      content,
      userId,
      postId
    );
    if (!createPost) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.CAN_NOT_CREATE_FACEBOOK_POST)
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
  const { brandId } = req.params;
  const { content, url } = req.body;
  const userId = req.body.currentUser._id;
  if (!content || !brandId || !url) {
    return systemError
      .setStatus(400)
      .setMessage(ErrorMessages.DATA_IS_REQUIRED)
      .throw();
  }
  try {
    const brands = await checkBrand(brandId);
    if (!brands) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.BRAND_NOT_FOUND)
        .throw();
    }
    const facebookData = await getAccount(brandId, PlatformEnum.FACEBOOK);
    const response = await postPhotoToFacebook({
      accessToken: facebookData.account.token,
      message: content,
      imageUrl: url,
      FACEBOOK_PAGE_ID: facebookData.account.pageID,
    });
    if (response?.message?.startsWith("Error")) {
      return res.json({ message: response.message });
    }
    if (!response) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.INVALID_FACEBOOK_API)
        .throw();
    }
    const postId = response.id;
    const createPost = await createSocialAccountAddPost(
      PlatformEnum.FACEBOOK,
      brandId,
      content,
      userId,
      postId
    );
    if (!createPost) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.CAN_NOT_CREATE_FACEBOOK_POST)
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
