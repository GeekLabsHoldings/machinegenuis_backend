import axios from "axios";
import { duration } from "moment";
let cachedCnbcVideos = [];

function getPublishedAfterDate() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  today.setDate(today.getDate() + diffToMonday - 7);
  today.setHours(0, 0, 0, 0);

  return today.toISOString();
}
async function searchVideos(query) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=50&key=${process.env.API_KEY_SEARCH_IN_YOUTUBE}`;
  // const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=50&publishedAfter=${getPublishedAfterDate()}&order=date&key=${process.env.API_KEY_SEARCH_IN_YOUTUBE}`;

  try {
    const searchResponse = await axios.get(searchUrl);
    const allVideos = searchResponse.data.items;

    const nonLiveVideos = allVideos.filter(
      (video) => video.snippet.liveBroadcastContent === "none"
    );

    console.log("Filtered non-live videos:-------->", nonLiveVideos);
    return nonLiveVideos;
  } catch (error) {
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data.error.errors.some((e) => e.reason === "quotaExceeded")
    ) {
      console.error(
        "Error: YouTube API quota exceeded. Please try again later."
      );
    } else {
      console.error("Error fetching search results:", error.message || error);
    }
    return [];
  }
}
async function fetchLatsVideosFromCnbc() {
  if (cachedCnbcVideos.length > 0) {
    return cachedCnbcVideos;
  }

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCvJJ_dzjViJCoLf5uKUTwoA&type=video&order=date&maxResults=50&key=${process.env.API_KEY_SEARCH_IN_YOUTUBE}`;

  try {
    const response = await axios.get(searchUrl);
    const videos = response.data.items;
    return videos.map((video) => ({
      videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      duration: "0",
    }));
  } catch (error) {
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data.error.errors.some((e) => e.reason === "quotaExceeded")
    ) {
      console.error("Error: YouTube API quota exceeded.");
      return { success: false, message: "YouTube API quota exceeded." };
    } else {
      console.error("Error fetching search results:", error.message || error);
      return {
        success: false,
        message: error.message || "Unknown error occurred.",
      };
    }
  }
}
export async function findYouTubeLinksForKeywords(keywordsArray, isCnbc) {
  const videoLinks = {
    cnbc: [],
    Footage: [],
  };
  if (isCnbc) {
    const cnbcVideos = await fetchLatsVideosFromCnbc();
    if (Array.isArray(cnbcVideos) && cnbcVideos.length > 0) {
      videoLinks.cnbc.push(...cnbcVideos);
    } else {
      console.log("No CNBC videos found or an error occurred");
    }
  }
  const keywords = keywordsArray.map((item) => item.keyword);
  const footageVideos = await Promise.all(
    keywords.map(async (keyword) => {
      const videos = await searchVideos(`${keyword} footage`);
      return videos;
    })
  );
  for (const videos of footageVideos) {
    if (videos && videos.length > 0) {
      for (const video of videos.slice(0, 5)) {
        const youtubeLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
        videoLinks.Footage.push({
          youtubeUrl: youtubeLink,
          duration: "0",
        });
      }
    } else {
      console.log("No footage videos found for keyword:");
    }
  }
  videoLinks.Footage = videoLinks.Footage.slice(0, 5);
  console.log("Final video links:", videoLinks);
  return videoLinks;
}
export async function searchVideosYouTube(query) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=100&key=${process.env.API_KEY_SEARCH_IN_YOUTUBE}`;

  try {
    const response = await axios.get(searchUrl);
    const videos = response.data.items;
    return videos.map((video) => ({
      title: video.snippet.title,
      videoId: video.id.videoId,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.default.url,
      videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
    }));
  } catch (error) {
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data.error.errors.some((e) => e.reason === "quotaExceeded")
    ) {
      console.error("Error: YouTube API quota exceeded.");
      return { success: false, message: "YouTube API quota exceeded." };
    } else {
      console.error("Error fetching search results:", error.message || error);
      return {
        success: false,
        message: error.message || "Unknown error occurred.",
      };
    }
  }
}
export async function searchVideosYouTubeCnbc(query) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCvJJ_dzjViJCoLf5uKUTwoA&q=${query}&type=video&maxResults=50&publishedAfter=${getPublishedAfterDate()}&order=date&key=${
    process.env.API_KEY_SEARCH_IN_YOUTUBE
  }`;

  try {
    const response = await axios.get(searchUrl);
    const videos = response.data.items;
    return videos.map((video) => ({
      title: video.snippet.title,
      videoId: video.id.videoId,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.default.url,
      videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
    }));
  } catch (error) {
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data.error.errors.some((e) => e.reason === "quotaExceeded")
    ) {
      console.error("Error: YouTube API quota exceeded.");
      return { success: false, message: "YouTube API quota exceeded." };
    } else {
      console.error("Error fetching search results:", error.message || error);
      return {
        success: false,
        message: error.message || "Unknown error occurred.",
      };
    }
  }
}
export async function trimVideoAws(youtubeVideoUrl, start_Time = null, end_Time = null) {
  try {
    const requestData = { url: youtubeVideoUrl };
    if (start_Time !== null) requestData.start_Time = start_Time;
    if (end_Time !== null) requestData.end_Time = end_Time;

    const response = await axios.post(
      "https://video.machinegenius.io/download-trim-video",
      requestData
    );
    return response.data.trimmed_video;
  } catch (error) {
    console.error("Error getting AWS download link:", error);
    return error;
  }
}

