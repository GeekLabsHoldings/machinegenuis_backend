const axios = require('axios');
require("dotenv").config();
const S3Uploader = require('./uploadToS3')

// const convertTextToAudio = async (text, index) => {
//     try {
//       const response = await axios({
//         method: 'post',
//         url: 'https://api.wellsaidlabs.com/v1/tts/stream',
//         headers: {
//           'X-Api-Key': process.env.WELLSAID_API_KEY, 
//           'Accept': 'audio/mpeg',
//           'Content-Type': 'application/json',
//         },
//         data: {
//           text: text,
//           speaker_id: "16",
//         },
//         responseType: 'stream'
//       });
  
//       const audioStream = response.data; 
//       return await S3Uploader.uploadToS3(audioStream, index);
//     } catch (error) {
//       console.error("Error converting text to audio:", error);
//       throw error;
//     }
// };

// // 01- Helper function to process an array sequentially with a delay
// const processSequentiallyWithDelay = async (array, delay, callback) => {
//     const results = [];
//     for (let i = 0; i < array.length; i++) {
//       const result = await callback(array[i], i);
//       results.push(result);
//       if (i < array.length - 1) {
//         await new Promise(resolve => setTimeout(resolve, delay));
//       }
//     }
//     return results;
// };

const convertTextToAudio = async (text, index) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = "Xbs7Hxi9YicGxdbtUTdv";
  console.log("USING ELEVENLABS");

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        responseType: "arraybuffer",
      }
    );

    const audioBuffer = response.data;
    return await S3Uploader.uploadToS3(audioBuffer, index);
  } catch (error) {
    console.error("Error converting text to audio:", error);
    throw error;
  }
};

const reConvertTextToAudio = async (text, index) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = "Xbs7Hxi9YicGxdbtUTdv";
  console.log("USING ELEVENLABS");

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        responseType: "arraybuffer",
      }
    );

    const audioBuffer = response.data;
    return await S3Uploader.overWriteToS3(audioBuffer, index);
  } catch (error) {
    console.error("Error converting text to audio:", error);
    throw error;
  }
};

module.exports = 
{
  convertTextToAudio,
  reConvertTextToAudio
}