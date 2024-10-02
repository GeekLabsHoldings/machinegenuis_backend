const servicesGetImages = require('../../Service/VideoEditingModule/getImages')

const getImg = async (req, res) => {
    try {
      const { searchImgKeyword } = req.body;
      if (!searchImgKeyword) {
        return res
          .status(400)
          .json({ success: false, error: "No image name provided" });
      }
      const images = await servicesGetImages.handleSearchImg(searchImgKeyword);
  
      return res.json({ success: true, images });
    } catch (error) {
      console.error("Error in getImg:", error);
      return res
        .status(500)
        .json({ success: false, error: "Something went wrong!" });
    }
};

const getImgNew = async (req, res) => {
  try {
    const { searchImgKeyword } = req.body;
    if (!searchImgKeyword) {
      return res
        .status(400)
        .json({ success: false, error: "No image name provided" });
    }
    const images = await servicesGetImages.handleSearchImgNew(searchImgKeyword);

    return res.json({ success: true, images });
  } catch (error) {
    console.error("Error in getImg:", error);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong!" });
  }
};

module.exports = {
  getImg,
  getImgNew
}