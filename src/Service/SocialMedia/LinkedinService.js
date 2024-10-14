import axios from "axios";

/**
 * Posts content to LinkedIn and returns the API response.
 * @param {string} content The text content to post.
 * @returns {Promise<Object>} The response from the LinkedIn API.
 */
export const postToLinkedIn = async (
  content,
  asset,
  LINKEDIN_AUTHOR_ID,
  LINKEDIN_ACCESS_TOKEN
) => {
  try {
    // Conditionally set media and category only if asset is provided
    const mediaData = asset
      ? {
          shareMediaCategory: "IMAGE",
          media: [
            {
              status: "READY",
              media: asset, // Ensure asset is a valid media URN (e.g., "urn:li:digitalmediaAsset:...")
            },
          ],
        }
      : {
          shareMediaCategory: "NONE", // No media provided
        };

    // Prepare the request body
    const requestBody = {
      author: `${LINKEDIN_AUTHOR_ID}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content || "",
          },
          ...mediaData, // Spread the mediaData object
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    // Send the post request
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
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
    if (error.response) {
      // Handle specific LinkedIn errors
      if (error.response.status === 422) {
        console.error(
          "Duplicate content detected. Consider modifying the content."
        );
      } else if (error.response.status === 400) {
        console.error("Bad request. Check media URN and content format.");
      }
    }

    console.error(
      "Failed to post to LinkedIn:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
export const registerUpload = async (LINKEDIN_AUTHOR_ID,LINKEDIN_ACCESS_TOKEN) => {
  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      {
        registerUploadRequest: {
          owner: `${LINKEDIN_AUTHOR_ID}`, // Update this to the correct owner
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
          "User-Agent": "PostmanRuntime/7.41.2",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
      }
    );

    // Extracting asset and uploadUrl
    const { value } = response.data;
    const { asset, uploadMechanism } = value;
    const uploadUrl =
      uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;

    console.log("Asset:", asset);
    console.log("Upload URL:", uploadUrl);

    return { asset, uploadUrl };
  } catch (error) {
    console.error(
      "Error registering upload:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};
