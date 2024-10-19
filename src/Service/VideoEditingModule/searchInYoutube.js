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
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&type=video&maxResults=50&publishedAfter=${getPublishedAfterDate()}&order=date&key=${
    process.env.API_KEY_SEARCH_IN_YOUTUBE
  }`;

  try {
    const searchResponse = await axios.get(searchUrl);
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

function filterVideosByDuration(videoDetails) {
  const filteredVideos = videoDetails.filter((video) => {
    if (!video.contentDetails || !video.contentDetails.duration) {
      return false;
    }
    const duration = video.contentDetails.duration;
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    if (!match) {
      return false;
    }

    const hours = match[1] ? parseInt(match[1].replace("H", "")) : 0;
    const minutes = match[2] ? parseInt(match[2].replace("M", "")) : 0;
    const seconds = match[3] ? parseInt(match[3].replace("S", "")) : 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return totalSeconds >= 90 && totalSeconds <= 480; // max 8 minutes
  });

  if (filteredVideos.length === 0) {
    return videoDetails.filter((video) => {
      if (!video.contentDetails || !video.contentDetails.duration) {
        return false;
      }
      const duration = video.contentDetails.duration;
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

      if (!match) {
        return false;
      }

      const hours = match[1] ? parseInt(match[1].replace("H", "")) : 0;
      const minutes = match[2] ? parseInt(match[2].replace("M", "")) : 0;
      const seconds = match[3] ? parseInt(match[3].replace("S", "")) : 0;
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      return totalSeconds >= 60 && totalSeconds <= 180; // 1 minute = 60 seconds, 3 minutes = 180 seconds
    });
  }

  return filteredVideos;
}

async function getAwsDownloadLink(youtubeVideoUrl) {
  try {
    const response = await axios.post(
      "http://18.118.105.172:3000/download-video",
      { youtubeVideoUrl }
    );
    return response.data.video_url;
  } catch (error) {
    console.error("Error getting AWS download link:", error);
    return null;
  }
}

async function findVideosForKeyword(keyword, isCnbc) {
  let videos = [];
  while (videos.length === 0) {
    const searchKeyword = isCnbc ? "cnbc" : keyword;
    videos = await searchVideos(searchKeyword);
    if (videos.length === 0 && !isCnbc) {
      console.warn(`No videos found for "${keyword}". Trying again with "cnbc"...`);
    }
  }
  return videos;
}
// Function to fetch and filter videos
async function fetchAndFilterVideos(query) {
  const videos = await searchVideos(query);
  const videoIds = videos.map((video) => video.id.videoId);
  const videoDetails = await getVideoDetails(videoIds);
  return filterVideosByDuration(videoDetails);
}
export async function findYouTubeLinksForKeywords(keywords, bodyAndOutro, introGenerate) {
  const videoLinks = {
    intro: {
      cnbc: { videos: [] },
      Footage: { videos: [] },
      text: introGenerate.text,
      keywords: introGenerate.keywordsAndImages.map(item => item.keyword),
      audioPath: introGenerate.audioPath
    },
    bodyAndOutro: [],
  };

  // Fetch videos for the intro keywords
  const introKeywords = videoLinks.intro.keywords;
  const introVideos = await Promise.all(
    introKeywords.map(async (keyword) => {
      const videos = await findVideosForKeyword(keyword, true);
      return videos;
    })
  );

  // Filter videos and add to intro
  const introVideoIds = introVideos.flat().map((video) => video.id.videoId);
  const introVideoDetails = await getVideoDetails(introVideoIds);
  const filteredIntroVideos = filterVideosByDuration(introVideoDetails);

  for (let i = 0; i < 3; i++) {
    const video = filteredIntroVideos[i % filteredIntroVideos.length];
    if (video) {
      const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
      const awsLink = await getAwsDownloadLink(youtubeLink);
      videoLinks.intro.cnbc.videos.push({
        awsLink: awsLink || "Error fetching AWS link",
        duration: "0",
      });
      videoLinks.intro.Footage.videos.push({
        awsLink: awsLink || "Error fetching AWS link",
        duration: "0",
      });
    }
  }

  for (const item of bodyAndOutro) {
    const keywordsForItem = item.keywords;
    let videos = [];
    for (const keyword of keywordsForItem) {
      videos = await findVideosForKeyword(keyword, true);
      if (videos.length > 0) break;
    }
    if (videos.length === 0 && keywordsForItem.length > 1) {
      videos = await findVideosForKeyword(keywordsForItem[1], true);
    }
    const videoIds = videos.map((video) => video.id.videoId);
    const videoDetails = await getVideoDetails(videoIds);
    const filteredVideos = filterVideosByDuration(videoDetails);
    videoLinks.bodyAndOutro.push({
      index: item.index,
      text: item.text,
      keywords: item.keywords,
      audioPath: item.audioPath,
      cnbc: { videos: [] },
      Footage: { videos: [] },
    });
    for (let i = 0; i < 3; i++) {
      const video = filteredVideos[i % filteredVideos.length];
      if (video) {
        const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
        const awsLink = await getAwsDownloadLink(youtubeLink);
        videoLinks.bodyAndOutro[videoLinks.bodyAndOutro.length - 1].cnbc.videos.push({
          awsLink: awsLink || "Error fetching AWS link",
          duration: "0",
        });
        videoLinks.bodyAndOutro[videoLinks.bodyAndOutro.length - 1].Footage.videos.push({
          awsLink: awsLink || "Error fetching AWS link",
          duration: "0",
        });
      }
    }
  }

  console.log("Final video links:", videoLinks);
  return videoLinks;
}















// export async function findYouTubeLinksForKeywords(introKeywords, bodyAndOutro) {
//   const videoLinks = {
//     intro: {
//       cnbc: { videos: [] },
//       Footage: { videos: [] }
//     },
//     bodyAndOutro: [],
//   };

//   // Fetch videos for the intro keywords
//   for (const keyword of introKeywords) {
//     // Fetch CNBC videos
//     const cnbcQuery = `${keyword} cnbc`;
//     const cnbcVideos = await fetchAndFilterVideos(cnbcQuery);
//     for (let i = 0; i < Math.min(4, cnbcVideos.length); i++) {
//       const video = cnbcVideos[i];
//       const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//       const awsLink = await getAwsDownloadLink(youtubeLink);
//       videoLinks.intro.cnbc.videos.push({
//         awsLink: awsLink || "Error fetching AWS link",
//         duration: "0",
//       });
//     }

//     // Fetch general Footage videos
//     const footageVideos = await fetchAndFilterVideos(keyword);
//     for (let i = 0; i < Math.min(4, footageVideos.length); i++) {
//       const video = footageVideos[i];
//       const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//       const awsLink = await getAwsDownloadLink(youtubeLink);
//       videoLinks.intro.Footage.videos.push({
//         awsLink: awsLink || "Error fetching AWS link",
//         duration: "0",
//       });
//     }
//   }

//   // Fetch videos for each bodyAndOutro item
//   for (const item of bodyAndOutro) {
//     const bodyKeywords = item.keywords;

//     videoLinks.bodyAndOutro.push({
//       index: item.index,
//       text: item.text,
//       keywords: item.keywords,
//       audioPath: item.audioPath,
//       cnbc: { videos: [] },
//       Footage: { videos: [] },
//     });

//     for (const keyword of bodyKeywords) {
//       // Fetch CNBC videos
//       const cnbcQuery = `${keyword} cnbc`;
//       const cnbcVideos = await fetchAndFilterVideos(cnbcQuery);
//       for (let i = 0; i < Math.min(4, cnbcVideos.length); i++) {
//         const video = cnbcVideos[i];
//         const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//         const awsLink = await getAwsDownloadLink(youtubeLink);
//         videoLinks.bodyAndOutro[item.index].cnbc.videos.push({
//           awsLink: awsLink || "Error fetching AWS link",
//           duration: "0",
//         });
//       }

//       // Fetch general Footage videos
//       const footageVideos = await fetchAndFilterVideos(keyword);
//       for (let i = 0; i < Math.min(4, footageVideos.length); i++) {
//         const video = footageVideos[i];
//         const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//         const awsLink = await getAwsDownloadLink(youtubeLink);
//         videoLinks.bodyAndOutro[item.index].Footage.videos.push({
//           awsLink: awsLink || "Error fetching AWS link",
//           duration: "0",
//         });
//       }
//     }
//   }

//   console.log("Final video links:", videoLinks);
//   return videoLinks;
// }






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
//       "http://18.118.105.172:3000/download-video",
//       { youtubeVideoUrl }
//     );
//     return response.data.video_url;
//   } catch (error) {
//     console.error("Error getting AWS download link:", error);
//     return null;
//   }
// }

// async function fetchAndFilterVideos(query) {
//   const videos = await searchVideos(query);
//   const videoIds = videos.map((video) => video.id.videoId);
//   const videoDetails = await getVideoDetails(videoIds);
//   return filterVideosByDuration(videoDetails);
// }

// export async function findYouTubeLinksForKeywords(introKeywords, bodyAndOutro) {
//   const videoLinks = {
//     intro: {
//       cnbc: { videos: [] },
//       Footage: { videos: [] },
//     },
//     bodyAndOutro: [],
//   };

//   // Fetch videos for the intro keywords
//   for (const keyword of introKeywords) {
//     // Fetch CNBC videos
//     const cnbcQuery = `${keyword} cnbc`;
//     const cnbcVideos = await fetchAndFilterVideos(cnbcQuery);
//     for (let i = 0; i < Math.min(4, cnbcVideos.length); i++) {
//       const video = cnbcVideos[i];
//       const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//       const awsLink = await getAwsDownloadLink(youtubeLink);
//       videoLinks.intro.cnbc.videos.push({
//         awsLink: awsLink || "Error fetching AWS link",
//         duration: "0",
//       });
//     }

//     // Fetch general Footage videos
//     const footageVideos = await fetchAndFilterVideos(keyword);
//     for (let i = 0; i < Math.min(4, footageVideos.length); i++) {
//       const video = footageVideos[i];
//       const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//       const awsLink = await getAwsDownloadLink(youtubeLink);
//       videoLinks.intro.Footage.videos.push({
//         awsLink: awsLink || "Error fetching AWS link",
//         duration: "0",
//       });
//     }
//   }

//   // Fetch videos for each bodyAndOutro item
//   for (const item of bodyAndOutro) {
//     const bodyKeywords = item.keywords;

//     videoLinks.bodyAndOutro.push({
//       index: item.index,
//       text: item.text,
//       keywords: item.keywords,
//       audioPath: item.audioPath,
//       cnbc: { videos: [] },
//       Footage: { videos: [] },
//     });

//     for (const keyword of bodyKeywords) {
//       // Fetch CNBC videos
//       const cnbcQuery = `${keyword} cnbc`;
//       const cnbcVideos = await fetchAndFilterVideos(cnbcQuery);
//       for (let i = 0; i < Math.min(4, cnbcVideos.length); i++) {
//         const video = cnbcVideos[i];
//         const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//         const awsLink = await getAwsDownloadLink(youtubeLink);
//         videoLinks.bodyAndOutro[item.index].cnbc.videos.push({
//           awsLink: awsLink || "Error fetching AWS link",
//           duration: "0",
//         });
//       }

//       // Fetch general Footage videos
//       const footageVideos = await fetchAndFilterVideos(keyword);
//       for (let i = 0; i < Math.min(4, footageVideos.length); i++) {
//         const video = footageVideos[i];
//         const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//         const awsLink = await getAwsDownloadLink(youtubeLink);
//         videoLinks.bodyAndOutro[item.index].Footage.videos.push({
//           awsLink: awsLink || "Error fetching AWS link",
//           duration: "0",
//         });
//       }
//     }
//   }

//   console.log("Final video links:", videoLinks);
//   return videoLinks;
// }
