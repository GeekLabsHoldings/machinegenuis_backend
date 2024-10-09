import S3_services from "../../Service/AWS/S3_Bucket/presinedURL";
import {
  addOrDeleteAccount,
  checkBrand,
  getAccount,
} from "../../Service/Operations/BrandCreation.service";
import {
  getPageAccessToken,
  postPhotoToFacebook,
  textPhotoToFacebook,
} from "../../Service/SocialMedia/facebook.service";
import { submitRedditPost } from "../../Service/SocialMedia/reddit.Service";
import { createSocialAccountAddPost } from "../../Service/SocialMedia/socialMedia.service";
import { FacebookPhotoQueueAdd } from "../../Utils/CronJobs/FacebookQueue/facebookPhotoQueue";
import { FacebookQueueAdd } from "../../Utils/CronJobs/FacebookQueue/facebookTextQueue";
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
  const { content, startTime } = req.body;
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
    if (!facebookData) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.ACCOUNT_NOT_FOUND)
        .throw();
    }
    const response = await getPageAccessToken(
      facebookData.account.pageID,
      facebookData.account.longAccessToken
    );
if(response?.error?.code === 190 ){
  return systemError
  .setStatus(400)
  .setMessage(ErrorMessages.FACEBOOK_TOKEN_EXPIRED)
  .throw();
}
    const accountData = {
      platform: PlatformEnum.FACEBOOK,
      account: {
        tokenPage: response.access_token,
        longAccessToken: facebookData.account.longAccessToken,
        pageID: facebookData.account.pageID,
        email: facebookData.account.email,
        password: facebookData.account.password,
        cookies: facebookData.account.cookies,
      },
    };
    await addOrDeleteAccount(brandId, accountData);
    await FacebookQueueAdd(content, startTime, brandId, userId);

    return res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const addPostSocialMediaFacebookPhoto = async (req, res, next) => {
  const { brandId } = req.params;
  const { content, url, startTime } = req.body;
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
    if (!facebookData) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.ACCOUNT_NOT_FOUND)
        .throw();
    }
    const response = await getPageAccessToken(
      facebookData.account.pageID,
      facebookData.account.longAccessToken
    );
if(response?.error?.code === 190 ){
  return systemError
  .setStatus(400)
  .setMessage(ErrorMessages.FACEBOOK_TOKEN_EXPIRED)
  .throw();
}
    const accountData = {
      platform: PlatformEnum.FACEBOOK,
      account: {
        tokenPage: response.access_token,
        longAccessToken: facebookData.account.longAccessToken,
        pageID: facebookData.account.pageID,
        email: facebookData.account.email,
        password: facebookData.account.password,
        cookies: facebookData.account.cookies,
      },
    };
    await addOrDeleteAccount(brandId, accountData);
    await FacebookPhotoQueueAdd(content, url, startTime, brandId, userId);
    return res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
