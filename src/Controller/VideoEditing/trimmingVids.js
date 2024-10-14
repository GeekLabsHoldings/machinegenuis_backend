const servProcessOnVideo = require('../../Service/VideoEditingModule/processOnVideo')

const processVideo = async (req, res) => {
    try {
      const { videoUrl , selectedContent} = req.body;

      const videoSegments = await servProcessOnVideo.processRecapAndVideo(videoUrl , selectedContent)
      res.json({
        message: "Video trimmed and screenshots generated successfully",
        videoSegments,
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = {
    processVideo
}