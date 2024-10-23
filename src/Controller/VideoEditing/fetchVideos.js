const {
  searchVideosYouTube,
  searchVideosYouTubeCnbc,
  trimVideoAws,
} = require("../../Service/VideoEditingModule/searchInYoutube");
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
const trimVideo = async (req, res) => {
  try {
    const { youtubeVideoUrl, start_Time, end_Time } = req.body;
    const videos = await trimVideoAws(youtubeVideoUrl, start_Time, end_Time);
    res.status(200).json(videos);
  } catch (error) {
    return systemError.sendError(res, error);
  }
};
module.exports = {
  searchVideosOnYouTube,
  searchVideosOnYouTubeCnbc,
  trimVideo,
};
