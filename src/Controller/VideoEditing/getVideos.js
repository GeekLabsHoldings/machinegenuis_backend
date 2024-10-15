const { splitContentInvestocracy,generateIntroKeyword } = require("../../Service/VideoEditingModule/splitContent");

export const gitDetailsContent = async (req, res) => {
  try {
    const { intro,content } = req.body;
    const introKeyword = await generateIntroKeyword(intro);
    const bodyAndOutro = await splitContentInvestocracy(content);
    res.status(200).json({intro:{introKeyword},bodyAndOutro});
  } catch (error) {
    console.error("Error generating recap:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};