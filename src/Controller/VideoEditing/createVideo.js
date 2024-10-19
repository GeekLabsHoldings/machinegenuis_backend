import { findYouTubeLinksForKeywords } from "../../Service/VideoEditingModule/searchInYoutube.js";
import {
  splitContentInvestocracy,
  generateIntroKeyword,
  generateIntroJson,
} from "../../Service/VideoEditingModule/splitContent";
export const gitDetailsContent = async (req, res) => {
  try {
    const { intro, content } = req.body;
    const introGenerate = await generateIntroJson(intro);
    const bodyAndOutro = await splitContentInvestocracy(content);

    console.log("bodyAndOutro", bodyAndOutro);
    console.log("introGenerate", introGenerate);

    const keywords = bodyAndOutro.map((item) => item.keywords).flat();
    const outro = bodyAndOutro.map((item) => item.outro).flat();
    const videoLinks = await findYouTubeLinksForKeywords(keywords, bodyAndOutro, introGenerate);

    console.log("videoLinks----", videoLinks);
    return res.status(200).json(videoLinks);
  } catch (error) {
    console.error("Error generating recap:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};




















// export const gitDetailsContent = async (req, res) => {
//   try {
//     const { intro, content } = req.body;
//     const introGenerate = await generateIntroJson(intro);
//     const bodyAndOutro = await splitContentInvestocracy(content);

//     console.log("bodyAndOutro", bodyAndOutro);
//     console.log("introGenerate", introGenerate);

//     const introKeywords = introGenerate.keywordsAndImages.map(item => item.keyword);
//     const videoLinks = await findYouTubeLinksForKeywords(introKeywords, bodyAndOutro);


//     videoLinks.intro.text = introGenerate.text;
//     videoLinks.intro.keywords = introKeywords;
//     videoLinks.intro.audioPath = introGenerate.audioPath;

//     console.log("videoLinks----", videoLinks);
//     return res.status(200).json(videoLinks);
//   } catch (error) {
//     console.error("Error generating recap:", error.message, error.stack);
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// };

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