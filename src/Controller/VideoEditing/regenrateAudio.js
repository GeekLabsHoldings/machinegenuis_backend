const ttsService = require("../../Service/VideoEditingModule/TTS");
// const regenrateAudio = async (req , res) => {
//     try {
//       const { selectedContent , index} = req.body;
//       if (!selectedContent || !index) {
//         return res.status(400).json({ success: false, error: "No content provided" });
//       }

//       const audioPath = await servicesTTS.processSequentiallyWithDelay(
//         paragraph.text,
//         3000,
//         (paragraph, index) => servicesTTS.convertTextToAudio(paragraph.text, index)
//       );

//       return res.json({ success: true, audioPath });
//     }
//     catch
//     {
//       return res.status(500).json({ success: false, error: "Error regenerating audio"})
//     }
// }

// const testAudio = async (req , res) => {
//   try {
//     const { selectedContent} = req.body;
//     if (!selectedContent) {
//       return res.status(400).json({ success: false, error: "No content provided" });
//     }

//     const audioPath = await servicesTTS.processSequentiallyWithDelay(
//       paragraph.text,
//       3000,
//       (paragraph, index) => servicesTTS.convertTextToAudio(paragraph.text, index)
//     );

//     return res.json({ success: true, audioPath });
//   }
//   catch
//   {
//     return res.status(500).json({ success: false, error: "Error regenerating audio"})
//   }
// }

const testAudio = async (req, res) => {
  try {
    const { selectedContent } = req.body;
    if (!selectedContent) {
      return res
        .status(400)
        .json({ success: false, error: "No content provided" });
    }
    const audioPath = await ttsService.reConvertTextToAudio(
      selectedContent,
      "test"
    );
    return res.json({ success: true, audioPath });
  } catch {
    return res
      .status(500)
      .json({ success: false, error: "Error regenerating audio" });
  }
};

const regenrateAudio = async (req, res) => {
  try {
    const { selectedContent, index } = req.body;
    if (!selectedContent || !index) {
      return res
        .status(400)
        .json({ success: false, error: "No content provided" });
    }
    const audioPath = await ttsService.reConvertTextToAudio(
      selectedContent,
      index
    );
    return res.json({ success: true, audioPath });
  } catch {
    return res
      .status(500)
      .json({ success: false, error: "Error regenerating audio" });
  }
};
module.exports = {
  testAudio,
  regenrateAudio,
};
