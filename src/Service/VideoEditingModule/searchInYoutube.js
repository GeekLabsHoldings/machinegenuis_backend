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

// export async function findYouTubeLinksForKeywords(keywords, bodyAndOutro) {
//   const videoLinks = {
//     intro: {
//       cnbc: { videos: [] },
//       Footage: { videos: [] },
//     },
//     bodyAndOutro: [],
//   };

//   const introKeyword = keywords[0];
//   let introVideos = await findVideosForKeyword(introKeyword, true);
//   if (introVideos.length === 0 && keywords.length > 1) {
//     introVideos = await findVideosForKeyword(keywords[1], true);
//   }
//   const introVideoIds = introVideos.map((video) => video.id.videoId);
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
//     }
//   }

//   for (let i = 0; i < 3; i++) {
//     const video = filteredIntroVideos[i % filteredIntroVideos.length];
//     if (video) {
//       const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//       const awsLink = await getAwsDownloadLink(youtubeLink);
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
//       index: videoLinks.bodyAndOutro.length,
//       text: item.text,
//       keywords: item.keywords,
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
//       }
//     }

//     for (let i = 0; i < 3; i++) {
//       const video = filteredVideos[i % filteredVideos.length];
//       if (video) {
//         const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//         const awsLink = await getAwsDownloadLink(youtubeLink);
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

    return totalSeconds >= 90 && totalSeconds <= 480;
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

      return totalSeconds >= 60 && totalSeconds <= 180;
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
export async function findYouTubeLinksForKeywords(keywords, bodyAndOutro) {
  const videoLinks = {
    intro: {
      cnbc: { videos: [] },
      Footage: { videos: [] },
    },
    bodyAndOutro: [],
  };

  const introVideos = await findVideosForKeywordWithRetries(keywords[0], true);  
  const introVideoIds = introVideos.map((video) => video.id.videoId);
  const introVideoDetails = await getVideoDetails(introVideoIds);
  const filteredIntroVideos = filterVideosByDuration(introVideoDetails);

  const uniqueCnbcVideos = new Set();
  for (let i = 0; i < 5 && i < filteredIntroVideos.length; i++) {
    const video = filteredIntroVideos[i];
    if (video && !uniqueCnbcVideos.has(video.id)) {
      uniqueCnbcVideos.add(video.id);
      const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
      const awsLink = await getAwsDownloadLink(youtubeLink);
      videoLinks.intro.cnbc.videos.push({
        awsLink: awsLink || "Error fetching AWS link",
        duration: "0",
      });
    }
  }

  const footageVideos = await findVideosForKeywordWithRetries(keywords[0], false);  
  const footageVideoIds = footageVideos.map((video) => video.id.videoId);
  const footageVideoDetails = await getVideoDetails(footageVideoIds);
  const filteredFootageVideos = filterVideosByDuration(footageVideoDetails);

  const uniqueFootageVideos = new Set();
  for (let i = 0; i < 5 && i < filteredFootageVideos.length; i++) {
    const video = filteredFootageVideos[i];
    if (video && !uniqueFootageVideos.has(video.id) && !uniqueCnbcVideos.has(video.id)) {
      uniqueFootageVideos.add(video.id);
      const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
      const awsLink = await getAwsDownloadLink(youtubeLink);
      videoLinks.intro.Footage.videos.push({
        awsLink: awsLink || "Error fetching AWS link",
        duration: "0",
      });
    }
  }

  for (const item of bodyAndOutro) {
    const keywordsForItem = item.keywords;
    let cnbcVideosForItem = [];
    let footageVideosForItem = [];

    for (const keyword of keywordsForItem) {
      const cnbcVideos = await findVideosForKeywordWithRetries(keyword, true);
      cnbcVideosForItem.push(...cnbcVideos);
      const footageVideos = await findVideosForKeywordWithRetries(keyword, false);
      footageVideosForItem.push(...footageVideos);
    }

    const cnbcVideoIds = cnbcVideosForItem.map((video) => video.id.videoId);
    const cnbcVideoDetails = await getVideoDetails(cnbcVideoIds);
    const filteredCnbcVideosForItem = filterVideosByDuration(cnbcVideoDetails);

    const footageVideoIdsForItem = footageVideosForItem.map((video) => video.id.videoId);
    const footageVideoDetailsForItem = await getVideoDetails(footageVideoIdsForItem);
    const filteredFootageVideosForItem = filterVideosByDuration(footageVideoDetailsForItem);

    videoLinks.bodyAndOutro.push({
      index: videoLinks.bodyAndOutro.length,
      text: item.text,
      keywords: item.keywords,
      cnbc: { videos: [] },
      Footage: { videos: [] },
    });

    const uniqueCnbcVideosForItem = new Set();
    for (let i = 0; i < 3 && i < filteredCnbcVideosForItem.length; i++) {
      const video = filteredCnbcVideosForItem[i];
      if (video && !uniqueCnbcVideosForItem.has(video.id)) {
        uniqueCnbcVideosForItem.add(video.id);
        const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
        const awsLink = await getAwsDownloadLink(youtubeLink);
        videoLinks.bodyAndOutro[videoLinks.bodyAndOutro.length - 1].cnbc.videos.push({
          awsLink: awsLink || "Error fetching AWS link",
          duration: "0",
        });
      }
    }

    const uniqueFootageVideosForItem = new Set();
    for (let i = 0; i < 3 && i < filteredFootageVideosForItem.length; i++) {
      const video = filteredFootageVideosForItem[i];
      if (video && !uniqueFootageVideosForItem.has(video.id) && !uniqueCnbcVideosForItem.has(video.id)) {
        uniqueFootageVideosForItem.add(video.id);
        const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
        const awsLink = await getAwsDownloadLink(youtubeLink);
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


async function findVideosForKeywordWithRetries(keyword, isCnbc) {
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const videos = await findVideosForKeyword(keyword, isCnbc);
      if (videos.length > 0) {
        return videos; // Return the videos if found
      } else {
        console.log(`No videos found for "${keyword}". Attempt ${attempts + 1} of ${maxRetries}.`);
        if (!isCnbc) {
          console.log(`Trying again with "cnbc"...`);
          isCnbc = true; // Change the keyword to "cnbc" and try again
        }
      }
    } catch (error) {
      console.error(`Error fetching videos for "${keyword}":`, error);
    }
    attempts++;
  }

  console.log(`Failed to find videos for "${keyword}" after ${maxRetries} attempts.`);
  return []; // Return an empty array if all attempts fail
}


