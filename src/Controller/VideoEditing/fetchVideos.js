const { searchVideosYouTube, searchVideosYouTubeCnbc } = require("../../Service/VideoEditingModule/searchInYoutube");
const { default: systemError } = require("../../Utils/Error/SystemError");

const searchVideosOnYouTube = async (req, res) => {
    try {
      const { query } = req.body;
      const videos = await searchVideosYouTube(query);
      
      res.status(200).json(videos);
    } catch (error) {
        return systemError.sendError(res, error);
    }
  };
  const searchVideosOnYouTubeCnbc = async (req, res) => {
    try {
      const { query } = req.body;
      const videos = await searchVideosYouTubeCnbc(query);
      
      res.status(200).json(videos);
    } catch (error) {
        return systemError.sendError(res, error);
    }
  };
  module.exports = {
    searchVideosOnYouTube,
    searchVideosOnYouTubeCnbc
  };
