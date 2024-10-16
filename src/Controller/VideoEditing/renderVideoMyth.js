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
    let currentStartTime = 0; // This will keep track of when each segment starts

    for (let i = 0; i < movieWithSegs.length; i++) {
      const seg = movieWithSegs[i];
      console.log("Processing segment:", seg);
      totalDuration += seg.audioUrl.duration;

      // Add audio track (Track 3)
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

      for (let j = 0; j < seg.videoSegments.length; j++) {
        const videoSegment = seg.videoSegments[j];

        // First 3-second video
        const firstVideoElement = {
          id: `video-3sec-${i}-${j}-1`,
          type: "video",
          track: 4,
          duration: 3,
          time: segsVidsStartTime,
          source: videoSegment.threeSecVideoUrl, // Current video
          volume: 0, // Silent
        };
      
        template.elements.push(firstVideoElement);
        segsVidsStartTime += 3; // Increment time for the next element
      
        // Now check if there is a next video segment (j+1)
        if (j + 1 < seg.videoSegments.length) {
          const nextVideoSegment = seg.videoSegments[j + 1];
      
          var secondVideoElement = {
            id: `video-3sec-${i}-${j}-2`,
            type: "video",
            track: 4,
            duration: 3,
            time: segsVidsStartTime,
            source: nextVideoSegment.threeSecVideoUrl, // Next video
            volume: 0, // Silent
          };
      
          template.elements.push(secondVideoElement);
          segsVidsStartTime += 3; // Increment time again
        }
        template.elements.push(firstVideoElement, secondVideoElement);

        for (let k = 0; k < videoSegment.screenshots.length; k++) {
          const screenshot = videoSegment.screenshots[k];

          const screenshotElement = {
            id: `screenshot-${i}-${j}-${k}`,
            type: "image",
            track: 4,
            duration: 5, // Assuming each screenshot stays for 5 seconds
            time: segsVidsStartTime, // Start time for the screenshot
            width: [
              { time: 0, value: "100%" },
              { time: 2.996, value: "105%" },
            ],
            height: [
              { time: 0.018, value: "100%" },
              { time: 2.996, value: "105%" },
            ],
            source: screenshot,
          };

          // Increment the time after the screenshot duration
          segsVidsStartTime += 5;

          // Push the screenshot to the template
          template.elements.push(screenshotElement);
        }
      }

      // Update the currentStartTime for the next segment
      currentStartTime += seg.audioUrl.duration;
    }

    template.duration = totalDuration; // Set the total duration of the video

    const creatomateClient = new Creatomate.Client(
      process.env.CREATOMATE_API_KEY
    );
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