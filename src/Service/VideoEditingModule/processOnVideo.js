const cloudinary = require("cloudinary").v2;
const { getAudioDurationInSeconds } = require('get-audio-duration');
const recapAllContentController = require('../../Controller/ContentCreation/OpenAi Controllers/recapTranscript_controller');


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

const generateVidsAndSH = async (videoUrl, totalDuration) => {
    const publicId = await uploadVideoToCloudinary(videoUrl);
    
    let start_offset = 0;
    const videoSegments = [];


    const numberOfSegments = Math.ceil(totalDuration / 10);

    for (let i = 0; i < numberOfSegments; i++) {
        const end_offset = Math.min(start_offset + 10, totalDuration); 


        const trimmedVideoUrl = cloudinary.url(publicId, {
            resource_type: "video",
            transformation: [
                { start_offset, end_offset },
            ],
        });

        const threeSecVideoUrl = cloudinary.url(publicId, {
            resource_type: "video",
            transformation: [
                { start_offset, end_offset: Math.min(start_offset + 3, totalDuration) }, 
            ],
        });


        const screenshots = [
            cloudinary.url(publicId, {
                resource_type: "video",
                format: "jpg",
                transformation: [
                    { start_offset: Math.min(start_offset + 4, totalDuration), duration: 1 },
                    { width: 600, crop: "scale" },
                ],
            }),
            cloudinary.url(publicId, {
                resource_type: "video",
                format: "jpg",
                transformation: [
                    { start_offset: Math.min(start_offset + 7, totalDuration), duration: 1 },
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

    return videoSegments;
};

const processRecapAndVideo = async (videoUrl, selectedContent) => {
    try {

        const recapData = await recapAllContentController.recapAllContent(selectedContent);
        console.log("recapData ========>", recapData);


        const totalDuration = parseInt(recapData.time.split(":")[1]);
        console.log("totalDuration ======>", totalDuration);


        const videoSegments = await generateVidsAndSH(videoUrl, totalDuration);


        return {
            videoSegments,
            time: recapData.time,
            audioUrl: recapData.audioUrl,
        };
    } catch (error) {
        throw new Error(`Error processing video: ${error.message}`);
    }
};


module.exports = {
    processRecapAndVideo
};
