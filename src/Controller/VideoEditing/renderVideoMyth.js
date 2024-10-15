const Creatomate = require("creatomate");
require("dotenv").config();

const renderVideo = async (req, res) => {
    try {
      const { movieWithSegs } = req.body;
  
      if (!movieWithSegs || movieWithSegs.length === 0) {
        return res.status(400).json({ success: false, error: "No content provided" });
      }
  
      const template = require("../../Utils/Utilities/TemplateMyth.json");
  
      for (let i = 0; i < movieWithSegs.length; i++) {
        const seg = movieWithSegs[i];
        console.log("Processing segment:", seg);
        for (let j = 0; j < seg.videoSegments.length; j++) {
            const videoSegment = seg.videoSegments[j];
            for (let k = 0; k < videoSegment.screenshots.length; k++) {
              const screenshot = videoSegment.screenshots[k];
              console.log("Processing screenshot:", screenshot);
            }
          }
      }
      return res.status(200).json({
        success: true,
      });
  
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  module.exports = {
    renderVideo,
  };
  