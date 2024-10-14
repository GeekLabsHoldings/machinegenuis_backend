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

const generateVidsAndSH = async (videoUrl, timeInSeconds, start_offset) => {
    const publicId = await uploadVideoToCloudinary(videoUrl);

    const duration = timeInSeconds;
    const videoSegments = [];

    for (let i = 0; i < Math.ceil(duration / 10); i++) {
        const end_offset = Math.min(start_offset + 10, start_offset + duration); 
        // Generate the full video segment (10 seconds or less for the last one)
        const trimmedVideoUrl = cloudinary.url(publicId, {
            resource_type: "video",
            transformation: [
                { start_offset, end_offset },
            ],
        });

        const threeSecVideoUrl = cloudinary.url(publicId, {
            resource_type: "video",
            transformation: [
                { start_offset, end_offset: Math.min(start_offset + 3, end_offset) }, 
            ],
        });

        const screenshots = [
            cloudinary.url(publicId, {
                resource_type: "video",
                format: "jpg",
                transformation: [
                    { start_offset: start_offset + 4, duration: 1 },
                    { width: 600, crop: "scale" },
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

    return { videoSegments, newStartOffset: start_offset }; 
};

const processRecapAndVideo = async (videoUrl, selectedContent) => {
    try {
        const recapData = await recapAllContentController.recapAllContent(selectedContent);

        const result = [];
        let globalStartOffset = 0;

        for (const recap of recapData) {
            const timeString = recap.time; 
            const timeInSeconds = parseInt(timeString.split(':')[1]); 
            const audioUrl = recap.audioUrl.url;

            const { videoSegments, newStartOffset } = await generateVidsAndSH(videoUrl, timeInSeconds, globalStartOffset);

            globalStartOffset = newStartOffset;

            result.push({
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
    processRecapAndVideo
};