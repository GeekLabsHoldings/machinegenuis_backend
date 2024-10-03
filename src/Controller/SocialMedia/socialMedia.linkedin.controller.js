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
  const { content, asset } = req.body;
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
    const response = await postToLinkedIn(
      content,
      asset,
      LinkedInAccount.account.owner,
      LinkedInAccount.account.token
    );
    if (!response || !response.id) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.INVALID_LINKEDIN_API)
        .throw();
    }
    const postId = response.id;
    const createPost = await createSocialAccountAddPost(
      PlatformEnum.LINKEDIN,
      brandId,
      content,
      userId,
      postId
    );
    if (!createPost) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.CAN_NOT_CREATE_LINKEDIN_ACCOUNT)
        .throw();
    }
    return res.status(200).json({
      result: createPost,
      linkedinPost: response,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred while posting to LinkedIn.";

    return systemError.sendError(res, { message: errorMessage });
  }
};
