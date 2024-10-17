import { findYouTubeLinksForKeywords, getAwsDownloadLink } from "../../Service/VideoEditingModule/searchInYoutube";

const {
  splitContentInvestocracy,
  generateIntroKeyword,
} = require("../../Service/VideoEditingModule/splitContent");



export const gitDetailsContent = async (req, res) => {
  try {
    const { intro, content } = req.body;
    const introKeywordData = await generateIntroKeyword(intro);
    const introKeyword = introKeywordData.keyword;
    console.log(introKeyword);

    const bodyAndOutro = await splitContentInvestocracy(content);
    const bodyKeywords = bodyAndOutro.map((part) => part.keywords[0]);
    const keywords = [introKeyword, ...bodyKeywords];

    const videoLinks = await findYouTubeLinksForKeywords(keywords, bodyAndOutro);
    console.log("Video links:----->", videoLinks);

    const result = {
      intro: {
        introKeyword: { keyword: introKeyword },
        awsLinks: videoLinks.intro?.map(link => link.awsLink) || ["No videos found"],
      },
      bodyAndOutro: await Promise.all(
        bodyAndOutro.map(async (part, index) => {
          console.log(`Keywords for part ${index}:`, part.keywords);

          const awsLinks = part.keywords.map(keyword => {
            return videoLinks[keyword]?.map(link => link.awsLink) || ["No videos found"];
          }).flat();

          console.log(`AWS Links for keywords "${part.keywords.join(", ")}":`, awsLinks);

          return {
            index,
            text: part.text,
            keywords: part.keywords,
            audioPath: {
              index: `${index}-${Date.now()}`,
              url: part.audioPath?.url || "Audio path not available",
              duration: part.audioPath?.duration || 0,
            },
            awsLinks,
          };
        })
      ),
    };
    console.log(result);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error generating recap:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// export const getFinalContent = async (req, res) => {
//   try {
//     const { intro, content } = req.body;
//     const introKeywordData = await generateIntroKeyword(intro);
//     const introKeyword = introKeywordData.keyword;
//     console.log(introKeyword);
//   }}
  
// export const gitDetailsContent = async (req, res) => {
//   try {
//     const { intro, content } = req.body;
//     const introKeywordData = await generateIntroKeyword(intro);
//     const introKeyword = introKeywordData.keyword;
//     console.log(introKeyword);

//     const bodyAndOutro = await splitContentInvestocracy(content);

//     const bodyKeywords = bodyAndOutro.map((part) => part.keywords[0]);

//     const keywords = [introKeyword, ...bodyKeywords];

//     const videoLinks = await findYouTubeLinksForKeywords(keywords, bodyAndOutro);
//     console.log("Video links:----->", videoLinks);

//     const result = {
//       intro: {
//         introKeyword: { keyword: introKeyword },
//         awsLinks: videoLinks[introKeyword]?.map(link => link.awsLink) || ["No videos found"],
//       },
//       bodyAndOutro: await Promise.all(
//         bodyAndOutro.map(async (part, index) => {
//           console.log(`Keywords for part ${index}:`, part.keywords);
          
//           const awsLinks = part.keywords.map(keyword => {
//             return videoLinks[keyword]?.map(link => link.awsLink) || ["No videos found"];
//           }).flat(); // Flatten the array if you have multiple links for each keyword
    
//           console.log(`AWS Links for keywords "${part.keywords.join(", ")}":`, awsLinks);
    
//           return {
//             index,
//             text: part.text,
//             keywords: part.keywords,
//             audioPath: {
//               index: `${index}-${Date.now()}`,
//               url: part.audioPath?.url || "Audio path not available",
//               duration: part.audioPath?.duration || 0,
//             },
//             awsLinks, // Include all AWS links
//           };
//         })
//       ),
//     };
//     console.log(result);

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error generating recap:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

