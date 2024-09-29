import { TwitterApi } from "twitter-api-v2";
import systemError from "../../Utils/Error/SystemError";
import { TwitterApi } from "twitter-api-v2";
import systemError from "../../Utils/Error/SystemError";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import axios from "axios";
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
export const getUserByUsername = async (userName, BearerToken) => {
  const url = `https://api.twitter.com/2/users/by/username/${userName}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${BearerToken}`, // Use your Bearer token or an env variable
      },
    });

    return response.data; // Response data containing user information
  } catch (error) {
    // Handle token expiration error
    if (error.response && error.response.status === 401) {
      console.error("Token expired or invalid. Please refresh your token.");
      throw new Error("Token expired or invalid.");
    }

    // Handle account not found error
    if (error.response && error.response.status === 404) {
      console.error(`Account with username ${AccountName} not found.`);
      throw new Error(`Account ${AccountName} not found.`);
    }

    // Handle other errors
    console.error(
      `Error fetching user by username: ${AccountName}`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

