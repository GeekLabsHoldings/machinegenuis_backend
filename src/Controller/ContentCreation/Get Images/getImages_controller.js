require("dotenv").config();
const axios = require('axios');

const handleSearchImg = async (searchImgKeyword , my_api_key) => {
  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        q: searchImgKeyword,
        engine: 'google_images',
        ijn: '0',
        api_key: my_api_key
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
    const { searchImgKeyword , api_key } = req.body;
    if (!searchImgKeyword || ! api_key) {
      return res
        .status(400)
        .json({ success: false, error: "No image name provided or api key " });
    }

    
    const images = await handleSearchImg(searchImgKeyword , api_key);


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