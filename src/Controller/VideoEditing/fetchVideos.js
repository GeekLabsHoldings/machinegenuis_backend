const { searchVideosYouTube } = require("../../Service/VideoEditingModule/searchInYoutube");

const searchVideosOnYouTube = async (req, res) => {
    try {
      const { query } = req.body;
      const videos = await searchVideosYouTube(query);
      
      res.status(200).json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error.message, error.stack);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  };
  module.exports = {
    searchVideosOnYouTube,
  };