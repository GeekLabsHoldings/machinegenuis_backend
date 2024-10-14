import axios from "axios";
import SocialMediaGroupsModel from "../../Model/SocialMedia/SocialMediaGroups.model";

export const getPageAccessToken = async (pageId, accessToken) => {
  const url = `https://graph.facebook.com/v16.0/${pageId}?fields=access_token&access_token=${accessToken}`;

  try {
    const response = await axios.get(url);
    console.log("Page Access Token:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      console.log("Error Message:", error.message);
    }
  }
};

export const textPhotoToFacebook = async ({
  accessToken,
  message,
  FACEBOOK_PAGE_ID,
}) => {
  const url = `https://graph.facebook.com/v20.0/${FACEBOOK_PAGE_ID}/feed`;

  try {
    const response = await axios.post(
      url,
      {
        message,
        published: "true",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the entire response
    console.log("Post created successfully:", response.data);
    return response.data;
  } catch (error) {
    // Check if there's an OAuthException error due to session expiration
    if (error.response && error.response.data && error.response.data.error) {
      const fbError = error.response.data.error;
      if (fbError.code === 190 && fbError.error_subcode === 463) {
        // Session expired error
        return {
          message: `Error: ${fbError.message}`,
        };
      }
    }

    // Handle other errors
    console.error(
      "Error posting photo:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const postPhotoToFacebook = async ({
  accessToken,
  message,
  imageUrl,
  FACEBOOK_PAGE_ID,
}) => {
  const url = `https://graph.facebook.com/v20.0/${FACEBOOK_PAGE_ID}/photos`;

  try {
    const response = await axios.post(
      url,
      {
        message,
        url: imageUrl,
        published: "true",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the entire response
    console.log("Photo posted successfully:", response.data);
    return response.data;
  } catch (error) {
    // Check if there's an OAuthException error due to session expiration
    if (error.response && error.response.data && error.response.data.error) {
      const fbError = error.response.data.error;
      if (fbError.code === 190 && fbError.error_subcode === 463) {
        // Session expired error
        return {
          message: `Error: ${fbError.message}`,
        };
      }
    }

    // Handle other errors
    console.error(
      "Error posting photo:",
      error.response?.data || error.message
    );
    throw error;
  }
};



export const GetSubCount = async(
  brand
  )=>{
  
    try {
      const channels = await SocialMediaGroupsModel.find({brand:brand, platform:"FACEBOOK"})
  
      const sum = channels.reduce((total, channel) => total + Number(channel.subscribers), 0);
      
      return sum;
    } catch (error) {
      console.log(error)
    }
  }
  