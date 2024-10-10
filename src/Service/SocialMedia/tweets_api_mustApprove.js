import axios from "axios";
import { OAuth } from "oauth";

export const getTweets = async (account_id, BEARER_TOKEN) => {
  try {
    const response = await axios.get(
      `https://api.twitter.com/2/users/${account_id}/tweets?max_results=100&exclude=replies,retweets`,
      {
        params: {
          "tweet.fields": "created_at,public_metrics,attachments",
          expansions: "attachments.media_keys",
          "media.fields": "url",
        },
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    );

    // Handle the response

    //console.log("Response data----------:", response.data.data);

    return response.data.data;
  } catch (error) {
    return error.response?.data || error.message;
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
  oauth.post(
    "https://api.x.com/2/tweets", // Request URL
    ACCESS_TOKEN, // Access token
    TOKEN_SECRET, // Token secret
    JSON.stringify(tweetData), // Data to be sent
    "application/json", // Content-Type
    (error, data, response) => {
      if (error) {
        console.log("Reply Error:", error);
        return error.response?.data || error.message;
      } else {
        //console.log("Tweet Posted:", data);
      }
    }
  );
};
