import axios from "axios";

function getPublishedAfterDate() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  today.setDate(today.getDate() + diffToMonday);
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}
function iso8601ToMinutes(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);

  return hours * 60 + minutes + seconds / 60;
}
async function searchVideos(query) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=50&publishedAfter=${getPublishedAfterDate()}&order=date&key=${process.env.API_KEY_SEARCH_IN_YOUTUBE}`;

  try {
    const searchResponse = await axios.get(searchUrl);
    const allVideos = searchResponse.data.items;

    const nonLiveVideos = allVideos.filter(video => video.snippet.liveBroadcastContent === 'none');
    
    if (nonLiveVideos.length === 0) {
      console.log("No non-live videos found.");
      return [];
    }

    const videoIds = nonLiveVideos.map(video => video.id.videoId);

    const videoDetails = await getVideoDetails(videoIds);

    const filteredVideos = videoDetails.filter(video => {
      const duration = video.contentDetails.duration;
      const minutes = iso8601ToMinutes(duration);
      return minutes >= 1 && minutes <= 6;
    });

    console.log("Filtered videos between 1 and 6 minutes:-------->", filteredVideos);
    return filteredVideos;
  } catch (error) {
    if (error.response && error.response.status === 403 && error.response.data.error.errors.some(e => e.reason === 'quotaExceeded')) {
      console.error("Error: YouTube API quota exceeded. Please try again later.");
    } else {
      console.error("Error fetching search results:", error.message || error);
    }
    return [];
  }
}
async function getVideoDetails(videoIds) {
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoIds.join(
    ","
  )}&part=contentDetails&key=${process.env.API_KEY_SEARCH_IN_YOUTUBE}`;

  try {
    const detailsResponse = await axios.get(detailsUrl);
    console.log("Video details response:-------->", detailsResponse.data.items);
    return detailsResponse.data.items;
  } catch (error) {
    console.error("Error fetching video details:", error);
    return [];
  }
}
async function getAwsDownloadLink(youtubeVideoUrl) {
  try {
    console.log("A -> DownloadVideo",youtubeVideoUrl);
    
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
    const searchKeyword = isCnbc ? "cnbc" : keyword;
    videos = await searchVideos(searchKeyword);
    if (videos.length === 0 && !isCnbc) {
      console.warn(`No videos found for "${keyword}". Trying again with "cnbc"...`);
    }
    attempts++;
  }
  return videos;
}
export async function findYouTubeLinksForKeywords(bodyAndOutro, introGenerate) {
  console.log(introGenerate);
  
  const videoLinks = {
    intro: {
      text: introGenerate.text,
      keywords: introGenerate.keywordsAndImages.map(item => item.keyword),
      cnbc: { videos: [] },
      Footage: { videos: [] },
      audioPath: introGenerate.audioPath
    },
    bodyAndOutro: [],
  };

  // Fetch videos for the intro keywords
  const introKeywords = videoLinks.intro.keywords;

  // Fetch CNBC videos
  const introCnbcVideos = await Promise.all(
    introKeywords.map(async (keyword) => {
      const videos = await findVideosForKeyword(keyword + " cnbc", true);
      return videos;
    })
  );

  // Add CNBC videos to intro
  for (const videos of introCnbcVideos) {
    for (const video of videos.slice(0, 5)) { // Limit to 5 videos
      const youtubeLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      const awsLink = await getAwsDownloadLink(youtubeLink);
      videoLinks.intro.cnbc.videos.push({
        awsLink: awsLink || "video not found",
        duration: "0",
      });
    }
  }

  // Fetch Footage videos
  const introFootageVideos = await Promise.all(
    introKeywords.map(async (keyword) => {
      const videos = await findVideosForKeyword(keyword, false);
      return videos;
    })
  );

  // Add Footage videos to intro
  for (const videos of introFootageVideos) {
    for (const video of videos.slice(0, 5)) { // Limit to 5 videos
      const youtubeLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
      const awsLink = await getAwsDownloadLink(youtubeLink);
      videoLinks.intro.Footage.videos.push({
        awsLink: awsLink || "video not found",
        duration: "0",
      });
    }
  }

  // Ensure intro videos are between 3 and 5
  videoLinks.intro.cnbc.videos = videoLinks.intro.cnbc.videos.slice(0, 5);
  videoLinks.intro.Footage.videos = videoLinks.intro.Footage.videos.slice(0, 5);

  // Process bodyAndOutro
  for (const item of bodyAndOutro) {
    const cnbcVideos = [];
    const footageVideos = [];

    for (const keyword of item.keywords) {
      // Fetch CNBC videos
      const cnbcResults = await findVideosForKeyword(keyword + " cnbc", true);
      for (const video of cnbcResults.slice(0, 5)) { // Limit to 5 videos
        const youtubeLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
        const awsLink = await getAwsDownloadLink(youtubeLink);
        cnbcVideos.push({
          awsLink: awsLink || "video not found",
          duration: "0",
        });
      }

      // Fetch Footage videos
      const footageResults = await findVideosForKeyword(keyword, false);
      for (const video of footageResults.slice(0, 5)) { // Limit to 5 videos
        const youtubeLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
        const awsLink = await getAwsDownloadLink(youtubeLink);
        footageVideos.push({
          awsLink: awsLink || "video not found",
          duration: "0",
        });
      }
    }

    videoLinks.bodyAndOutro.push({
      index: item.index,
      text: item.text,
      keywords: item.keywords,
      audioPath: item.audioPath,
      cnbc: { videos: cnbcVideos.slice(0, 5) }, // Ensure max 5 videos
      Footage: { videos: footageVideos.slice(0, 5) }, // Ensure max 5 videos
    });
  }

  console.log("Final video links:", videoLinks);
  return videoLinks;
}