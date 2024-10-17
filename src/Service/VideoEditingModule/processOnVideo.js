require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { getAudioDurationInSeconds } = require("get-audio-duration");
const recapAllContentController = require("../../Controller/ContentCreation/OpenAi Controllers/recapTranscript_controller");
const { promisify } = require("util");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const delay = promisify(setTimeout);

const uploadVideoToCloudinary = async (videoUrl, maxRetries = 5, delayTime = 5000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await cloudinary.uploader.upload_large(videoUrl, {
        resource_type: "video",
      });
      console.log("Upload successful:", result);
      return result.public_id;
    } catch (error) {
      console.log(`Attempt ${attempt} failed with error: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delayTime / 1000} seconds...`);
        await delay(delayTime);
      } else {
        throw new Error("Max retries reached. Upload failed.");
      }
    }
  }
};

const generateVidsAndSH = async (publicId, startTime, endTime) => {
  const videoSegments = [];

  for (let currentStart = startTime; currentStart < endTime; currentStart += 10) {
    const end_offset = Math.min(currentStart + 10, endTime);
    const segmentDuration = end_offset - currentStart;
    console.log("segmentDuration:", segmentDuration);

    const trimmedVideoUrl = cloudinary.url(publicId, {
      resource_type: "video",
      transformation: [{ start_offset: currentStart, end_offset }],
    });

    const threeSecVideoUrl = cloudinary.url(publicId, {
      resource_type: "video",
      transformation: [
        {
          start_offset: currentStart,
          end_offset: Math.min(currentStart + 3, end_offset),
        },
      ],
    });

    let screenshots = [];

    if (segmentDuration >= 10) {
      screenshots = [
        cloudinary.url(publicId, {
          resource_type: "video",
          format: "jpg",
          transformation: [{ start_offset: currentStart + 6, duration: 1 }, { width: 600, crop: "scale" }],
        }),
        cloudinary.url(publicId, {
          resource_type: "video",
          format: "jpg",
          transformation: [{ start_offset: currentStart + 7, duration: 1 }, { width: 600, crop: "scale" }],
        }),
        cloudinary.url(publicId, {
          resource_type: "video",
          format: "jpg",
          transformation: [{ start_offset: currentStart + 8, duration: 1 }, { width: 600, crop: "scale" }],
        }),
        cloudinary.url(publicId, {
          resource_type: "video",
          format: "jpg",
          transformation: [{ start_offset: currentStart + 9, duration: 1 }, { width: 600, crop: "scale" }],
        }),
      ];
    } else {
      screenshots = [
        cloudinary.url(publicId, {
          resource_type: "video",
          format: "jpg",
          transformation: [{ start_offset: currentStart + 5, duration: 1 }, { width: 600, crop: "scale" }],
        }),
      ];
    }

    videoSegments.push({
      segment: videoSegments.length + 1,
      trimmedVideoUrl,
      threeSecVideoUrl,
      screenshots,
    });
  }

  return videoSegments;
};

const processRecapAndVideo = async (videoUrl, selectedContent) => {
  try {
    const publicId = await uploadVideoToCloudinary(videoUrl);

    const recapData = await recapAllContentController.recapAllContent(selectedContent);
    const result = [];

    for (const recap of recapData) {
      const timeString = recap.time;
      const [startTime, endTime] = timeString.split(":").map(Number);

      const videoSegments = await generateVidsAndSH(publicId, startTime, endTime);

      result.push({
        recape: recap.recape,
        time: recap.time,
        audioUrl: recap.audioUrl,
        videoSegments,
      });
    }

    return result;
  } catch (error) {
    throw new Error(`Error processing video: ${error.message}`);
  }
};

module.exports = {
  processRecapAndVideo,
};
