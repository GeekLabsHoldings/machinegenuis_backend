import { socialMediaModel } from "../../Model/SocialMedia/SocialMedia.model";
import {
  registerUpload,
  postToLinkedIn,
} from "../../Service/SocialMedia/LinkedinService";
import { createSocialAccountAddPost } from "../../Service/SocialMedia/socialMedia.service";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";
import {
  checkBrand,
  getAccount,
} from "../../Service/Operations/BrandCreation.service";
import { LinkedInQueueAdd } from "../../Utils/CronJobs/linkedInQueue/linkedIn.Queue";
export const getDataLinkedin = async (req, res) => {
  try {
    const { brand } = req.params;
    if (!brand) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.DATA_IS_REQUIRED)
        .throw();
    }
    const brands = await checkBrand(brand);
    if (!brands) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.BRAND_NOT_FOUND)
        .throw();
    }
    const LinkedInAccount = await getAccount(brand, PlatformEnum.LINKEDIN);
    console.log("LinkedTest", LinkedInAccount);
    const { asset, uploadUrl } = await registerUpload(
      LinkedInAccount.account.owner,
      LinkedInAccount.account.token
    );

    if (!asset || !uploadUrl) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.ISSING_ASSET_OR_UPLOAD__URL)
        .throw();
    }
    // Respond with only asset and uploadUrl if successful
    return res.status(200).json({
      success: true,
      message: "Upload registered successfully",
      data: {
        asset,
        uploadUrl,
        LinkedIn_Token: LinkedInAccount.account.token,
      },
    });
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
export const addPostSocialMediaLinkedin = async (req, res) => {
  const { content, asset ,startTime} = req.body;
  const { brandId } = req.params;
  const userId = req.body.currentUser._id;
  if (!brandId) {
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
    const LinkedInAccount = await getAccount(brandId, PlatformEnum.LINKEDIN);
    if(!LinkedInAccount){
      return systemError
      .setStatus(400)
      .setMessage(ErrorMessages.ACCOUNT_NOT_FOUND)
      .throw();
    }
    await LinkedInQueueAdd(content, asset, brandId, userId,startTime);
    return res.status(200).json({
      message:"Success"
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while posting to LinkedIn.";

    return systemError.sendError(res, { message: errorMessage });
  }
};
