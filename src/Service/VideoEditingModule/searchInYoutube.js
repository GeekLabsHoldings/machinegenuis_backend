import axios from "axios";

function getPublishedAfterDate() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  today.setDate(today.getDate() + diffToMonday);
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

async function searchVideos(query) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=50&publishedAfter=${getPublishedAfterDate()}&order=date&key=${process.env.API_KEY_SEARCH_IN_YOUTUBE}`;

  try {
    const searchResponse = await axios.get(searchUrl);
    const allVideos = searchResponse.data.items;

    const nonLiveVideos = allVideos.filter(video => video.snippet.liveBroadcastContent === 'none');

    console.log("Filtered non-live videos:-------->", nonLiveVideos);
    return nonLiveVideos;
  } catch (error) {
    if (error.response && error.response.status === 403 && error.response.data.error.errors.some(e => e.reason === 'quotaExceeded')) {
      console.error("Error: YouTube API quota exceeded. Please try again later.");
    } else {
      console.error("Error fetching search results:", error.message || error);
    }
    return [];
  }
}

async function getAwsDownloadLink(youtubeVideoUrl) {
  try {
    console.log("A -> DownloadVideo", youtubeVideoUrl);
    
    const response = await axios.post(
      "https://video.machinegenius.io/download-trim-video",
      { url: youtubeVideoUrl }
    );
    console.log("AWS download link:--------------------------->", response.data.trimmed_video);
    return response.data.trimmed_video;
  } catch (error) {
    console.error("Error getting AWS download link:", error);
    return "video not found";
  }
}

async function findVideosForKeyword(keyword, isCnbc) {
  let videos = [];
  let attempts = 0;
  while (videos.length === 0 && attempts < 3) {
    const searchKeyword = isCnbc ? "cnbc channel" : keyword; 
    videos = await searchVideos(searchKeyword);
    if (videos.length === 0 && !isCnbc) {
      console.warn(`No videos found for "${keyword}". Trying again with "cnbc"...`);
    }
    attempts++;
  }
  return videos;
}

export async function findYouTubeLinksForKeywords(keywordsArray) {
  const videoLinks = {
    cnbc: [], 
    Footage: [], 
  };

  const keywords = keywordsArray.map(item => item.keyword);

  // Fetch CNBC videos for all keywords
  const cnbcVideos = await Promise.all(
    keywords.map(async (keyword) => {
      const videos = await findVideosForKeyword(keyword, true);
      return videos;
    })
  );

  // Add CNBC videos to the result, limit to 5
  for (const videos of cnbcVideos) {
    for (const video of videos.slice(0, 5)) { // Limit to 5 videos per keyword
      const youtubeLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      videoLinks.cnbc.push({ // Adding videos directly into the array
        youtubeUrl: youtubeLink, // Use the YouTube link directly
        duration: "0", // Default duration to "0"
      });
    }
  }

  // Fetch Footage videos for all keywords
  const footageVideos = await Promise.all(
    keywords.map(async (keyword) => {
      const videos = await findVideosForKeyword(keyword + " footage", false); // Use "footage" instead of "footages"
      return videos;
    })
  );

  // Add Footage videos to the result, limit to 5
  for (const videos of footageVideos) {
    if (videos && videos.length > 0) { // Check if videos are returned
      for (const video of videos.slice(0, 5)) { // Limit to 5 videos per keyword
        const youtubeLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
        videoLinks.Footage.push({ // Adding videos directly into the array
          youtubeUrl: youtubeLink, // Use the YouTube link directly
          duration: "0", // Default duration to "0"
        });
      }
    } else {
      console.log("No footage videos found for keyword:",);
    }
  }

  // Limit the result to 5 videos for each category (CNBC and Footage)
  videoLinks.cnbc = videoLinks.cnbc.slice(0, 5);
  videoLinks.Footage = videoLinks.Footage.slice(0, 5);

  console.log("Final video links:", videoLinks);
  return videoLinks;
}

export async function searchVideosYouTube(query) {
  
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=100&key=${process.env.API_KEY_SEARCH_IN_YOUTUBE}`;

  try {
    const response = await axios.get(searchUrl);
    const videos = response.data.items;
    return videos.map(video => ({
      title: video.snippet.title,
      videoId: video.id.videoId,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.default.url,
     videoUrl:`https://www.youtube.com/watch?v=${video.id.videoId}`
    }));
  } catch (error) {
    if (error.response && error.response.status === 403 && error.response.data.error.errors.some(e => e.reason === 'quotaExceeded')) {
      console.error("Error: YouTube API quota exceeded. Please try again later.");
    } else {
      console.error("Error fetching search results:", error.message || error);
    }
    return [];
  }
}

