const splitsSTP = require('../../Service/VideoEditingModule/splitContentSTP')
const splitsINV = require('../../Service/VideoEditingModule/splitContentINV')
require("dotenv").config();
import { findYouTubeLinksForKeywords } from "../../Service/VideoEditingModule/searchInYoutube.js";


const splitAndConvertSTP = async (req , res) => {
    try {
      const {intro , selectedContent } = req.body;
      if (!selectedContent) {
        return res.status(400).json({ success: false, error: "No content provided" });
      }
  
      const slideJson = await splitsSTP.generateSlideJson(intro);
      const paragraphJson = await splitsSTP.splitContent(selectedContent);
      return res
      .status(200)
      .json({ success: true, paragraphJson , slideJson});    
    }
    catch
    {
      return res.status(500).json({ success: false, error: "Error processing content"})
    }
}

const splitAndConvertINV = async (req, res) => {
  try {
    const { intro, content } = req.body;
    const introGenerate = await splitsINV.generateIntroJson(intro);
    const bodyAndOutro = await splitsINV.splitContentInvestocracy(content);

    const keywords = bodyAndOutro.map((item) => item.keywords).flat();
    const outro = bodyAndOutro.map((item) => item.outro).flat();
    const videoLinks = await findYouTubeLinksForKeywords(
      keywords,
      bodyAndOutro,
      introGenerate
    );

    console.log("videoLinks----", videoLinks);
    return res.status(200).json(videoLinks);
  } catch (error) {
    console.error("Error generating recap:", error.message, error.stack);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};


module.exports = {
    splitAndConvertSTP,
    splitAndConvertINV
}