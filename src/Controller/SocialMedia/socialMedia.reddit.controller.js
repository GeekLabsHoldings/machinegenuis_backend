import { submitRedditPost } from "../../Service/SocialMedia/reddit.Service";
import { createAccountSocialMedia } from "../../Service/SocialMedia/socialMedia.service";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import systemError from "../../Utils/Error/SystemError";
import { PlatformEnum } from "../../Utils/SocialMedia/Platform";

export const addPostSocialMediaRedditText = async (req, res, next) => {
  const { brand, content, title, token } = req.body;
  const userId = req.body.currentUser._id;
  if ((!content || !brand, !title, !token)) {
    return systemError
      .setStatus(400)
      .setMessage(ErrorMessages.DATA_IS_REQUIRED)
      .throw();
  }
  try {
    const response = await submitRedditPost({
      title,
      token,
      subreddit: brand,
      text: content,
    });
    if (!response) {
      return systemError
        .setStatus(400)
        .setMessage(ErrorMessages.INVALID_REDDIT_API)
        .throw();
    }
    const postId = response.json.data.id;
    const createPost = await createAccountSocialMedia(
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
      redditPost: response,
    });
  } catch (error) {
    console.log(error);
  }
};
