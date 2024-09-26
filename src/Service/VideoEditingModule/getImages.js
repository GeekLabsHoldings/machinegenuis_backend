require("dotenv").config();
const axios = require('axios');

const handleSearchImg = async (searchImgKeyword) => {
  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        q: searchImgKeyword,
        engine: 'google_images',
        ijn: '0',
        api_key: process.env.SERPAPI_KEY || "fdfd21a7ca252814cc50f03f935c29f99bc21c6478d5778c6f104f4881670eae"
      }
    });

    const imageResults = response.data.images_results || [];

    const filteredImageUrls = imageResults
      .filter(image => image.original && image.original_width < 900 && image.original_width > 600 && image.original_height < 800 && image.original_height > 400) 
      .map(image => image.original) 
      .filter(url => !url.includes('fbsbx')
      && !url.includes('www.consilium.europa.eu')
      && !url.includes('www.politico.com')
      && !url.includes('newsobserver')
      && !url.includes("usnews")
      && !url.includes("macleans")); 

    return filteredImageUrls;
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

module.exports =
{
    getImg,
    handleSearchImg
}