const slides = require('../../Service/VideoEditingModule/splitContent')
require("dotenv").config();

const splitAndConvert = async (req , res) => {
    try {
      const {intro , selectedContent } = req.body;
      if (!selectedContent) {
        return res.status(400).json({ success: false, error: "No content provided" });
      }
  
      const slideJson = await slides.generateSlideJson(intro);
      const paragraphJson = await slides.splitContent(selectedContent);
      return res
      .status(200)
      .json({ success: true, paragraphJson , slideJson});    
    }
    catch
    {
      return res.status(500).json({ success: false, error: "Error processing content"})
    }
}

module.exports = {
    splitAndConvert
}