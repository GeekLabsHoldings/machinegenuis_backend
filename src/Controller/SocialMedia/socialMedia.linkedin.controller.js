import { socialMediaModel } from "../../Model/SocialMedia/SocialMedia.model";
import postToLinkedIn from "../../Service/SocialMedia/LinkedinService";
import { createAccountSocialMedia } from "../../Service/SocialMedia/socialMedia.service";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";

export const addPostSocialMediaLinkedin = async (req, res) => {
  const { brand, content } = req.body;
  const userId = req.body.currentUser._id;
  if (!content || !brand) {
    return systemError
      .setStatus(400)
      .setMessage(ErrorMessages.DATA_IS_REQUIRED)
      .throw();
  }
  try {
    const response = await postToLinkedIn(content);
    if (!response || !response.id) {
      return systemError.setStatus(400)
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
      return systemError.setStatus(400)
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
