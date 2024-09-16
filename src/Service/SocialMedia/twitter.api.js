import { TwitterApi } from "twitter-api-v2";
import systemError from "../../Utils/Error/SystemError";
import { TwitterApi } from "twitter-api-v2";
import systemError from "../../Utils/Error/SystemError";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";

export const TwitterSocialMedia = async ({
  content,
  mediaId,
  appKey,
  appSecret,
  accessToken,
  accessSecret,
}) => {
  const client = new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
  });

  try {
    const tweet = await client.v2.tweet({
      text: content,
      media: mediaId
        ? {
            media_ids: [mediaId],
          }
        : undefined,
    });
    if (tweet.status && tweet.status === 403) {
      return systemError
        .setStatus(403)
        .getMessage(ErrorMessages.TWEET_IS_ALREADY_EXIST);
    }
    return {
      message: "Tweet posted successfully",
      tweet,
    };
  } catch (error) {
    console.error("Error posting tweet:", error);
  }
};
