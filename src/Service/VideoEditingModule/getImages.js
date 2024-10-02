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
      && !url.includes("macleans")
      && !url.includes("www.intel.com")); 

    return filteredImageUrls;
  } catch (error) {
    console.error("Error getting image:", error);
    throw error;
  }
};

const handleSearchImgNew = async (searchImgKeyword) => {
  const clientId = '2EXTEjC2SflA_MDUCG1v9_XdTMzHTVvmx6FlEgOywNo';
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchImgKeyword)}&per_page=20&client_id=${clientId}`;

  try {
    const response = await axios.get(url);

    if (response.status === 200 && response.data.results.length > 0) {
      const imageUrls = response.data.results.map(image => image.urls.raw);
      return imageUrls;
    } else {
      console.log("No images found for the search term.");
      return [];
    }
  } catch (error) {
    if (error.response) {
      console.error(`Error fetching images from Unsplash: ${error.response.status} - ${error.response.data.errors}`);
    } else if (error.request) {
      console.error("No response received from Unsplash:", error.request);
    } else {
      console.error("Error in setting up the request:", error.message);
    }
    throw error;
  }
};


module.exports =
{
    handleSearchImg,
    handleSearchImgNew
}