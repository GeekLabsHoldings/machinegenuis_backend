const cloudinary = require("cloudinary").v2;
const { getAudioDurationInSeconds } = require('get-audio-duration');
const recapAllContentController = require('../../Controller/ContentCreation/OpenAi Controllers/recapTranscript_controller')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadVideoToCloudinary = async (videoUrl) => {
    try {
      const result = await cloudinary.uploader.upload(videoUrl, {
        resource_type: "video",
      });
      return result.public_id;
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
};

const generateVidsAndSH = async (videoUrl) => {
    const publicId = await uploadVideoToCloudinary(videoUrl);

    const duration = await getAudioDurationInSeconds(videoUrl);

    let start_offset = 0;
    const videoSegments = [];

    for (let i = 0; i < Math.ceil(duration / 10); i++) {  
      const end_offset = start_offset + 10;

      const trimmedVideoUrl = cloudinary.url(publicId, {
        resource_type: "video",
        transformation: [
          { start_offset, end_offset },
        ],
      });

      const threeSecVideoUrl = cloudinary.url(publicId, {
        resource_type: "video",
        transformation: [
          { start_offset, end_offset: start_offset + 3 },  
        ],
      });

      const screenshots = [
        cloudinary.url(publicId, {
          resource_type: "video",
          format: "jpg",
          transformation: [
            { start_offset: start_offset + 4, duration: 1 }, 
            { width: 600 , crop: "scale" }, 
          ],
        }),
        cloudinary.url(publicId, {
          resource_type: "video",
          format: "jpg",
          transformation: [
            { start_offset: start_offset + 7, duration: 1 }, 
            { width: 600, crop: "scale" },
          ],
        }),
      ];

      videoSegments.push({
        segment: i + 1,
        trimmedVideoUrl,
        threeSecVideoUrl,
        screenshots,
      });

      start_offset += 10;
    }
    return videoSegments
};

const processRecapAndVideo = async (videoUrl , selectedContent) => {
    try {
        // Get recap content (includes video URL and other info)
        const recapData = await recapAllContentController.recapAllContent(selectedContent);
        console.log("recapData ========>",recapData);
        
        // Extract the video URL from recapData (assuming audioUrl.url is your video URL)
        const audioUrl = recapData.audioUrl.url;
        console.log("audioUrl =========>",audioUrl);
        // Generate video segments and screenshots
        const videoSegments = await generateVidsAndSH(videoUrl);

        // Return final response with segments, time, and audio URL
        return {
            videoSegments,
            time: recapData.time,
            audioUrl: recapData.audioUrl,
        };
    } catch (error) {
        throw new Error(`Error processing video: ${error.message}`);
    }
};

// Example of exporting the function
module.exports = {
    processRecapAndVideo
};