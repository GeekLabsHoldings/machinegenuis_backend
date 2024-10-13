import { TwitterApi } from "twitter-api-v2";
import systemError from "../../Utils/Error/SystemError";
import { TwitterApi } from "twitter-api-v2";
import systemError from "../../Utils/Error/SystemError";
import { ErrorMessages } from "../../Utils/Error/ErrorsEnum";
import axios from "axios";
import { OAuth } from "oauth";

export const TwitterSocialMediaAddPost = async ({
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
      text: content || "",
      media: mediaId
        ? {
            media_ids: [mediaId],
          }
        : undefined,
    });
    return { tweet, success: 200, message: "Tweet posted successfully" };
  } catch (error) {
    return error;
  }
};
export const getUserByUsername = async (userName, BearerToken) => {
  const url = `https://api.twitter.com/2/users/by/username/${userName}?user.fields=profile_image_url`;

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
export const addReply = async (
  CONSUMER_KEY,
  CONSUMER_SECRET,
  ACCESS_TOKEN,
  TOKEN_SECRET,
  reply,
  tweetId
) => {
  const oauth = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    CONSUMER_KEY,
    CONSUMER_SECRET,
    "1.0A", // OAuth version
    null,
    "HMAC-SHA1"
  );

  // Data to send in the request body
  const tweetData = {
    text: reply,
    reply: {
      in_reply_to_tweet_id: tweetId,
    },
  };

  // Sending the request directly using OAuth without manual signature generation
  return new Promise((resolve, reject) => {
    oauth.post(
      "https://api.x.com/2/tweets", // Request URL
      ACCESS_TOKEN, // Access token
      TOKEN_SECRET, // Token secret
      JSON.stringify(tweetData), // Data to be sent
      "application/json", // Content-Type
      (error, data, response) => {
        if (error) {
          return reject(error);
        } else {
          const parsedData = JSON.parse(data);
          resolve({
            message: "Reply posted successfully",
            data: parsedData,
          });
        }
      }
    );
  });
};
