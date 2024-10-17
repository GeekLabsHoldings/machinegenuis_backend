const Creatomate = require("creatomate");
require("dotenv").config();

const renderVideo = async (req, res) => {
  try {
    const { movieWithSegs } = req.body;

    if (!movieWithSegs || movieWithSegs.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No content provided" });
    }

    const template = require("../../Utils/Utilities/TemplateMyth.json");

    let totalDuration = 0;
    let currentStartTime = 0;

    for (let i = 0; i < movieWithSegs.length; i++) {
      const seg = movieWithSegs[i];
      totalDuration += seg.audioUrl.duration;

      const audioElement = {
        id: `audio-${i}`,
        type: "audio",
        track: 3,
        time: currentStartTime,
        duration: seg.audioUrl.duration,
        source: seg.audioUrl.url,
      };
      template.elements.push(audioElement);

      let segsVidsStartTime = currentStartTime;

      const segmentDuration = seg.audioUrl.duration;
      const num3SecVideos = Math.floor(segmentDuration / 3);
      const remainingTime = segmentDuration % 3;

      for (let j = 0; j < seg.videoSegments.length; j++) {
        const videoSegment = seg.videoSegments[j];

        // Add the 3-second video
        const videoElement = {
          id: `video-3sec-${i}-${j}`,
          type: "video",
          track: 4,
          duration: 3,
          time: segsVidsStartTime,
          source: videoSegment.threeSecVideoUrl,
          volume: 0, 
        };

        template.elements.push(videoElement);
        segsVidsStartTime += 3; 
        const screenshots = videoSegment.screenshots; 
        const screenshotsToAdd = 4;
        const screenshotDuration = (4 / screenshotsToAdd)*4; 

        for (let k = 0; k < screenshotsToAdd; k++) {
          const screenshot = screenshots[k % screenshots.length]; 

          const screenshotElement = {
            id: `screenshot-${i}-${j}-${k}`,
            type: "image",
            track: 4,
            duration: screenshotDuration,
            time: segsVidsStartTime,
            width: [
              { time: 0, value: "100%" },
              { time: screenshotDuration - 0.004, value: "105%" },
            ],
            height: [
              { time: 0.018, value: "100%" },
              { time: screenshotDuration - 0.004, value: "105%" },
            ],
            source: screenshot,
          };

          template.elements.push(screenshotElement);
          segsVidsStartTime += screenshotDuration; 
        }
      }

      currentStartTime += seg.audioUrl.duration;
    }

    totalDuration = totalDuration + 5; 
    template.duration = totalDuration; 
    template.elements[2].time = totalDuration - 8; 
    template.elements[3].time = totalDuration - 5; 

    const creatomateClient = new Creatomate.Client(process.env.CREATOMATE_API_KEY);
    const options = { source: template, modifications: {} };

    console.log("Rendering video, please wait...");
    const renders = await creatomateClient.render(options, 3000);
    const videoUrl = renders[0].url;

    return res.status(200).json({
      success: true,
      videoUrl,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  renderVideo,
};
