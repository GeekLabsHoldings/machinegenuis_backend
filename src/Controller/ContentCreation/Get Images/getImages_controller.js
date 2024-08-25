require("dotenv").config();
const axios = require('axios');

const handleSearchImg = async (searchImgKeyword) => {
  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        q: searchImgKeyword,
        engine: 'google_images',
        ijn: '0',
        api_key: process.env.SERPAPI_KEY || "1af5ce540feb70a718d1bc3038d05229fc3439667054d2e9ed4c272256468f2d"
      }
    });
    
    return response.data.images_results || []; 
  } catch (error) {
    console.error("Error getting image:", error);
    throw error;
  }
};

const getImg = async (req, res) => {
  try {
    const { searchImgKeyword } = req.body;
    if (!searchImgKeyword) {
      return res
        .status(400)
        .json({ success: false, error: "No image name provided" });
    }

    
    const images = await handleSearchImg(searchImgKeyword);


    return res.json({ success: true, images });
  } catch (error) {
    console.error("Error in getImg:", error);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong!" });
  }
};

export
{
    getImg
}