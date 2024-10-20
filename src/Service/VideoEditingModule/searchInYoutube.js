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
    console.log("Search response:", searchResponse.data.items);
    return searchResponse.data.items;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

async function getVideoDetails(videoIds) {
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoIds.join(
    ","
  )}&part=contentDetails&key=${process.env.API_KEY_SEARCH_IN_YOUTUBE}`;

  try {
    const detailsResponse = await axios.get(detailsUrl);
    return detailsResponse.data.items;
  } catch (error) {
    console.error("Error fetching video details:", error);
    return [];
  }
}

async function getAwsDownloadLink(youtubeVideoUrl) {
  try {
    const response = await axios.post(
      "https://video.machinegenius.io/download-trim-video",
      { url: youtubeVideoUrl }
    );
    console.log("AWS download link:", response.data.trimmed_video);
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























// import axios from "axios";

// function getPublishedAfterDate() {
//   const today = new Date();
//   const dayOfWeek = today.getDay();
//   const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
//   today.setDate(today.getDate() + diffToMonday);
//   today.setHours(0, 0, 0, 0);
//   return today.toISOString();
// }

// async function searchVideos(query) {
//   const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
//     query
//   )}&type=video&maxResults=50&publishedAfter=${getPublishedAfterDate()}&order=date&key=${
//     process.env.API_KEY_SEARCH_IN_YOUTUBE
//   }`;

//   try {
//     const searchResponse = await axios.get(searchUrl);
//     return searchResponse.data.items;
//   } catch (error) {
//     console.error("Error fetching search results:", error);
//     return [];
//   }
// }

// async function getVideoDetails(videoIds) {
//   const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoIds.join(
//     ","
//   )}&part=contentDetails&key=${process.env.API_KEY_SEARCH_IN_YOUTUBE}`;

//   try {
//     const detailsResponse = await axios.get(detailsUrl);
//     return detailsResponse.data.items;
//   } catch (error) {
//     console.error("Error fetching video details:", error);
//     return [];
//   }
// }

// function filterVideosByDuration(videoDetails) {
//   const filteredVideos = videoDetails.filter((video) => {
//     if (!video.contentDetails || !video.contentDetails.duration) {
//       return false;
//     }
//     const duration = video.contentDetails.duration;
//     const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

//     if (!match) {
//       return false;
//     }

//     const hours = match[1] ? parseInt(match[1].replace("H", "")) : 0;
//     const minutes = match[2] ? parseInt(match[2].replace("M", "")) : 0;
//     const seconds = match[3] ? parseInt(match[3].replace("S", "")) : 0;
//     const totalSeconds = hours * 3600 + minutes * 60 + seconds;

//     return totalSeconds >= 90 && totalSeconds <= 480; // max 8 minutes
//   });

//   if (filteredVideos.length === 0) {
//     return videoDetails.filter((video) => {
//       if (!video.contentDetails || !video.contentDetails.duration) {
//         return false;
//       }
//       const duration = video.contentDetails.duration;
//       const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

//       if (!match) {
//         return false;
//       }

//       const hours = match[1] ? parseInt(match[1].replace("H", "")) : 0;
//       const minutes = match[2] ? parseInt(match[2].replace("M", "")) : 0;
//       const seconds = match[3] ? parseInt(match[3].replace("S", "")) : 0;
//       const totalSeconds = hours * 3600 + minutes * 60 + seconds;

//       return totalSeconds >= 60 && totalSeconds <= 180; // 1 minute = 60 seconds, 3 minutes = 180 seconds
//     });
//   }

//   return filteredVideos;
// }

// async function getAwsDownloadLink(youtubeVideoUrl) {
//   try {
//     const response = await axios.post(
//       "http://18.118.105.172:3000/download-trim-video",
//       { youtubeVideoUrl }
//     );
//     return response.data.video_url;
//   } catch (error) {
//     console.error("Error getting AWS download link:", error);
//     return null;
//   }
// }

// async function findVideosForKeyword(keyword, isCnbc) {
//   let videos = [];
//   while (videos.length === 0) {
//     const searchKeyword = isCnbc ? "cnbc" : keyword;
//     videos = await searchVideos(searchKeyword);
//     if (videos.length === 0 && !isCnbc) {
//       console.warn(`No videos found for "${keyword}". Trying again with "cnbc"...`);
//     }
//   }
//   return videos;
// }
// // Function to fetch and filter videos
// async function fetchAndFilterVideos(query) {
//   const videos = await searchVideos(query);
//   const videoIds = videos.map((video) => video.id.videoId);
//   const videoDetails = await getVideoDetails(videoIds);
//   return filterVideosByDuration(videoDetails);
// }
// export async function findYouTubeLinksForKeywords(keywords, bodyAndOutro, introGenerate) {
//   const videoLinks = {
//     intro: {
//       text: introGenerate.text,
//       keywords: introGenerate.keywordsAndImages.map(item => item.keyword),
//       cnbc: { videos: [] },
//       Footage: { videos: [] },
//       audioPath: introGenerate.audioPath
//     },
//     bodyAndOutro: [],
//   };

//   // Fetch videos for the intro keywords
//   const introKeywords = videoLinks.intro.keywords;
//   const introVideos = await Promise.all(
//     introKeywords.map(async (keyword) => {
//       const videos = await findVideosForKeyword(keyword, true);
//       return videos;
//     })
//   );

//   // Filter videos and add to intro
//   const introVideoIds = introVideos.flat().map((video) => video.id.videoId);
//   const introVideoDetails = await getVideoDetails(introVideoIds);
//   const filteredIntroVideos = filterVideosByDuration(introVideoDetails);

//   for (let i = 0; i < 3; i++) {
//     const video = filteredIntroVideos[i % filteredIntroVideos.length];
//     if (video) {
//       const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//       const awsLink = await getAwsDownloadLink(youtubeLink);
//       videoLinks.intro.cnbc.videos.push({
//         awsLink: awsLink || "Error fetching AWS link",
//         duration: "0",
//       });
//       videoLinks.intro.Footage.videos.push({
//         awsLink: awsLink || "Error fetching AWS link",
//         duration: "0",
//       });
//     }
//   }

//   for (const item of bodyAndOutro) {
//     const keywordsForItem = item.keywords;
//     let videos = [];
//     for (const keyword of keywordsForItem) {
//       videos = await findVideosForKeyword(keyword, true);
//       if (videos.length > 0) break;
//     }
//     if (videos.length === 0 && keywordsForItem.length > 1) {
//       videos = await findVideosForKeyword(keywordsForItem[1], true);
//     }
//     const videoIds = videos.map((video) => video.id.videoId);
//     const videoDetails = await getVideoDetails(videoIds);
//     const filteredVideos = filterVideosByDuration(videoDetails);
//     videoLinks.bodyAndOutro.push({
//       index: item.index,
//       text: item.text,
//       keywords: item.keywords,
//       audioPath: item.audioPath,
//       cnbc: { videos: [] },
//       Footage: { videos: [] },
//     });
//     for (let i = 0; i < 3; i++) {
//       const video = filteredVideos[i % filteredVideos.length];
//       if (video) {
//         const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//         const awsLink = await getAwsDownloadLink(youtubeLink);
//         videoLinks.bodyAndOutro[videoLinks.bodyAndOutro.length - 1].cnbc.videos.push({
//           awsLink: awsLink || "Error fetching AWS link",
//           duration: "0",
//         });
//         videoLinks.bodyAndOutro[videoLinks.bodyAndOutro.length - 1].Footage.videos.push({
//           awsLink: awsLink || "Error fetching AWS link",
//           duration: "0",
//         });
//       }
//     }
//   }

//   console.log("Final video links:", videoLinks);
//   return videoLinks;
// }