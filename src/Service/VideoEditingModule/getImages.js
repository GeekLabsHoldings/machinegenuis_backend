require("dotenv").config();
const axios = require('axios');
const serviceEnhanceImg = require('../../Service/VideoEditingModule/enahnceImg');

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

    const regenerateImgs = async (imageResults) => {
      const enhancedImages = [];
      
      for (let i = 0; i < imageResults.length; i++) {
          const url = imageResults[i];
          console.log("url.original----> " + url.original);
          
          try {
              const enhanced = await serviceEnhanceImg.enhanceImg(url.original);
              enhancedImages.push(enhanced);
              console.log("enhancedImages--->" + enhancedImages);
          } catch (error) {
              console.error('Error enhancing image:', error.message);
          }
      }
      return enhancedImages;
      
    };

    const filteredImageUrls = imageResults.map(image => image.original) 

      
    // const enhancedImages = await regenerateImgs(imageResults.slice(0,10));
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