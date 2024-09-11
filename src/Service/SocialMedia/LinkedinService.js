import axios from "axios";

/**
 * Posts content to LinkedIn and returns the API response.
 * @param {string} content The text content to post.
 * @returns {Promise<Object>} The response from the LinkedIn API.
 */
async function postToLinkedIn(content) {
  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: `urn:li:person:${process.env.ID}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
          "User-Agent": "PostmanRuntime/7.41.2",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error(
      "Failed to post to LinkedIn:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export default postToLinkedIn;
