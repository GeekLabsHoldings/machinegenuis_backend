import axios from "axios";

/**
 * Posts content to LinkedIn and returns the API response.
 * @param {string} content The text content to post.
 * @returns {Promise<Object>} The response from the LinkedIn API.
 */
export const postToLinkedIn = async  (content, asset)=> {
  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: `${process.env.LINKEDIN_AUTHOR_ID}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: content || "",
            },
            shareMediaCategory: "IMAGE",
            media: [
              {
                status: "READY",
                media: asset,
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
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
export const registerUpload = async () => {
  try {
    const response = await axios.post(
      'https://api.linkedin.com/v2/assets?action=registerUpload',
      {
        registerUploadRequest: {
          owner: 'urn:li:person:e9TWnKwRZC', // Update this to the correct owner
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          serviceRelationships: [
            {
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent'
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
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
    const uploadUrl = uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;

    console.log('Asset:', asset);
    console.log('Upload URL:', uploadUrl);

    return { asset, uploadUrl };
  } catch (error) {
    console.error('Error registering upload:', error.response ? error.response.data : error.message);
    return null;
  }
};


