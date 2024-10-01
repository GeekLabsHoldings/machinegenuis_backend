import { socialMediaModel } from "../../Model/SocialMedia/SocialMedia.model";
import {
  registerUpload,
  postToLinkedIn,
} from "../../Service/SocialMedia/LinkedinService";
import { createAccountSocialMedia } from "../../Service/SocialMedia/socialMedia.service";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";
export const getDataLinkedin = async (req, res) => {
  try {
    // Call registerUpload and get the asset + uploadUrl
    const { asset, uploadUrl } = await registerUpload();

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
        linkedIn_Access_Token: process.env.LINKEDIN_ACCESS_TOKEN,
      },
    });
  } catch (error) {
    // Handle errors and respond with error message
    return res.status(400).json({
      success: false,
      message: `Failed to register upload: ${error.message}`,
    });
  }
};

export const addPostSocialMediaLinkedin = async (req, res) => {
  const { brand, content, asset } = req.body;
  const userId = req.body.currentUser._id;
  if (!content || !brand) {
    return systemError
      .setStatus(400)
      .setMessage(ErrorMessages.DATA_IS_REQUIRED)
      .throw();
  }
  try {
    const response = await postToLinkedIn(content, asset);
    if (!response || !response.id) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.INVALID_LINKEDIN_API)
        .throw();
    }
    const postId = response.id;
    const createPost = await createAccountSocialMedia(
      PlatformEnum.LINKEDIN,
      brand,
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
