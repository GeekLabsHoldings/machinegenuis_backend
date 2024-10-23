const Creatomate = require("creatomate");
require("dotenv").config();

const renderVideo = async (req, res) => {
  try {
    const { introGenerate, bodyAndOutro } = req.body;

    if (!introGenerate || !bodyAndOutro) {
      return res
        .status(400)
        .json({ success: false, error: "No content provided" });
    }

    const template = require("../../Utils/Utilities/TemplateINV.json");

    let introDuration = introGenerate.audioPath.duration || 15;
    console.log("introDuration==>", introDuration);

    let bodyDuration = bodyAndOutro.reduce(
      (acc, paragraph) => acc + (paragraph.audioPath.duration || 15),
      0
    );
    console.log("bodyDuration==>", bodyDuration);

    const totalDuration = introDuration + bodyDuration;
    template.duration = totalDuration;

    for (let index = 0; index < introGenerate.videos.Footage.length; index++) {
      const footageUrl = introGenerate.videos.Footage[index].youtubeUrl;
      console.log(footageUrl);

      template.elements.push({
        id: `footage-${index}`,
        type: "video",
        track: 3,
        time: introDuration,
        source: footageUrl,
      });
    }

    const track3Element = {
      id: "70464e09-4fe2-4651-a0a1-4195dc911a22",
      type: "video",
      track: 3,
      time: 0, 
      source: introGenerate.videos.cnbc[0].videoUrl, 
    };

    template.elements.push(track3Element);

    return res.status(200).json({
      success: true,
      template,
    });

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  renderVideo,
};
