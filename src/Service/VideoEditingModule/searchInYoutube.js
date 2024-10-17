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
    console.log("Details response:", detailsResponse.data.items);
    return detailsResponse.data.items;
  } catch (error) {
    console.error("Error fetching video details:", error);
    return [];
  }
}

function filterVideosByDuration(videoDetails) {
  return videoDetails.filter((video) => {
    if (!video.contentDetails || !video.contentDetails.duration) {
      console.warn(`Duration not found for video: ${video.id}`);
      return false;
    }
    const duration = video.contentDetails.duration;
    const match = duration.match(/PT(\d+M)?(\d+S)?/);
    if (!match) return false;
    const minutes = match[1] ? parseInt(match[1].replace("M", "")) : 0;
    const seconds = match[2] ? parseInt(match[2].replace("S", "")) : 0;
    const totalSeconds = minutes * 60 + seconds;
    return totalSeconds >= 60 && totalSeconds <= 360;
  });
}

 async function getAwsDownloadLink(youtubeVideoUrl) {
  try {
    const response = await axios.post(
      "http://18.118.105.172:3000/download-video",
      
      {
        youtubeVideoUrl,
      }
    );
    console.log("AWS response:", response.data.video_url);
    return response.data.video_url;
  } catch (error) {
    console.error("Error getting AWS download link:", error);
    return null;
  }
}
// export async function findYouTubeLinksForKeywords(keywords, bodyAndOutro) {
//   const videoLinks = {};

//   const introKeyword = keywords[0]; 
//   const introVideos = await searchVideos(introKeyword);
//   console.log(
//     `Searching for intro keyword: ${introKeyword}, Found videos:`,
//     introVideos
//   );

//   if (introVideos.length > 0) {
//     const introVideoIds = introVideos.map((video) => video.id.videoId);
//     const introVideoDetails = await getVideoDetails(introVideoIds);
//     const filteredIntroVideos = filterVideosByDuration(introVideoDetails);

//     const awsLinksForIntro = [];
//     for (let i = 0; i < Math.min(5, filteredIntroVideos.length); i++) {
//       const video = filteredIntroVideos[i];
//       const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//       const awsLink = await getAwsDownloadLink(youtubeLink);
//       console.log("AWS link for intro---------->>>>:", awsLink);
//       awsLinksForIntro.push({
//         youtubeLink,
//         awsLink: awsLink || "Error fetching AWS link",
//       });
//     }

//     // Ensure at least 5 video entries
//     while (awsLinksForIntro.length < 5) {
//       awsLinksForIntro.push({ youtubeLink: null, awsLink: "No videos found" });
//     }

//     videoLinks.intro = awsLinksForIntro;
//   } else {
//     videoLinks.intro = Array(5).fill({ youtubeLink: null, awsLink: "No videos found" });
//   }

//   for (const item of bodyAndOutro) {
//     const keyword = item.keywords[0];
//     const videos = await searchVideos(keyword);
//     console.log(`Searching for keyword: ${keyword}, Found videos:`, videos);

//     if (videos.length > 0) {
//       const videoIds = videos.map((video) => video.id.videoId);
//       const videoDetails = await getVideoDetails(videoIds);
//       const filteredVideos = filterVideosByDuration(videoDetails);

//       if (filteredVideos.length > 0) {
//         const awsLinksForKeyword = [];
//         for (let i = 0; i < Math.min(1, filteredVideos.length); i++) {
//           const video = filteredVideos[i];
//           const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
//           const awsLink = await getAwsDownloadLink(youtubeLink);
//           console.log("AWS link for bodyAndOutro---------->>>>:", awsLink);
//           awsLinksForKeyword.push({
//             youtubeLink,
//             awsLink: awsLink || "Error fetching AWS link",
//           });
//         }
//         videoLinks[keyword] = awsLinksForKeyword.length > 0
//           ? awsLinksForKeyword
//           : [{ youtubeLink: null, awsLink: "No videos found" }];
//       } else {
//         videoLinks[keyword] = [{ youtubeLink: null, awsLink: "No videos found" }];
//       }
//     } else {
//       videoLinks[keyword] = [{ youtubeLink: null, awsLink: "No videos found" }];
//     }
//   }

//   console.log("Final video links:", videoLinks);
//   return videoLinks;
// } 


export async function findYouTubeLinksForKeywords(keywords, bodyAndOutro) {
  const videoLinks = {};

  const introKeyword = keywords[0]; 
  const introVideos = await searchVideos(introKeyword);
  console.log(
    `Searching for intro keyword: ${introKeyword}, Found videos:`,
    introVideos
  );

  if (introVideos.length > 0) {
    const introVideoIds = introVideos.map((video) => video.id.videoId);
    const introVideoDetails = await getVideoDetails(introVideoIds);
    const filteredIntroVideos = filterVideosByDuration(introVideoDetails);

    const awsLinksForIntro = [];
    for (let i = 0; i < 5; i++) {
      const video = filteredIntroVideos[i % filteredIntroVideos.length];
      if (video) {
        const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
        const awsLink = await getAwsDownloadLink(youtubeLink);
        console.log("AWS link for intro---------->>>>:", awsLink);
        awsLinksForIntro.push({
          youtubeLink,
          awsLink: awsLink || "Error fetching AWS link",
        });
      } else {
        awsLinksForIntro.push({ youtubeLink: null, awsLink: "No videos found" });
      }
    }

    videoLinks.intro = awsLinksForIntro;
  } else {
    videoLinks.intro = Array(5).fill({ youtubeLink: null, awsLink: "No videos found" });
  }

  for (const item of bodyAndOutro) {
    const keyword = item.keywords[0];
    const videos = await searchVideos(keyword);
    console.log(`Searching for keyword: ${keyword}, Found videos:`, videos);

    if (videos.length > 0) {
      const videoIds = videos.map((video) => video.id.videoId);
      const videoDetails = await getVideoDetails(videoIds);
      const filteredVideos = filterVideosByDuration(videoDetails);

      if (filteredVideos.length > 0) {
        const awsLinksForKeyword = [];
        for (let i = 0; i < Math.min(1, filteredVideos.length); i++) {
          const video = filteredVideos[i];
          const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;
          const awsLink = await getAwsDownloadLink(youtubeLink);
          console.log("AWS link for bodyAndOutro---------->>>>:", awsLink);
          awsLinksForKeyword.push({
            youtubeLink,
            awsLink: awsLink || "Error fetching AWS link",
          });
        }
        videoLinks[keyword] = awsLinksForKeyword.length > 0
          ? awsLinksForKeyword
          : [{ youtubeLink: null, awsLink: "No videos found" }];
      } else {
        videoLinks[keyword] = [{ youtubeLink: null, awsLink: "No videos found" }];
      }
    } else {
      videoLinks[keyword] = [{ youtubeLink: null, awsLink: "No videos found" }];
    }
  }

  console.log("Final video links:", videoLinks);
  return videoLinks;
}



  


