import { findYouTubeLinksForKeywords } from "../../Service/VideoEditingModule/searchInYoutube.js";
import {
  splitContentInvestocracy,
  generateIntroJson,
} from "../../Service/VideoEditingModule/splitContent";
export const gitDetailsContent = async (req, res) => {
  try {
    const { intro, content } = req.body;
    const introGenerate = await generateIntroJson(intro);
    const bodyAndOutro = await splitContentInvestocracy(content);
    const videoLinks = await findYouTubeLinksForKeywords(bodyAndOutro, introGenerate);

    console.log("videoLinks----", videoLinks);
    return res.status(200).json(videoLinks);
  } catch (error) {
    console.error("Error generating recap:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

























// import { findYouTubeLinksForKeywords } from "../../Service/VideoEditingModule/searchInYoutube.js";
// import {
//   splitContentInvestocracy,
//   generateIntroJson,
// } from "../../Service/VideoEditingModule/splitContent";
// export const gitDetailsContent = async (req, res) => {
//   try {
//     const { intro, content } = req.body;
//     const introGenerate = await generateIntroJson(intro);
//     const bodyAndOutro = await splitContentInvestocracy(content);

//     console.log("bodyAndOutro", bodyAndOutro);
//     console.log("introGenerate", introGenerate);

//     const keywords = bodyAndOutro.map((item) => item.keywords).flat();
//     const outro = bodyAndOutro.map((item) => item.outro).flat();
//     const videoLinks = await findYouTubeLinksForKeywords(keywords, bodyAndOutro, introGenerate);

//     console.log("videoLinks----", videoLinks);
//     return res.status(200).json(videoLinks);
//   } catch (error) {
//     console.error("Error generating recap:", error.message, error.stack);
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// };