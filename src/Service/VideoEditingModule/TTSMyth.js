const S3Uploader = require('./uploadToS3')
const axios = require('axios');

const convertTextToAudio = async (text, index) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = 'ntsvu3d2mcHBIU4bxZv8';
    console.log("USING ELEVENLABS MARCUS");
    
    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text: text,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          responseType: 'arraybuffer', 
        }
      );
  
      const audioBuffer = response.data;
      return await S3Uploader.uploadToS3(audioBuffer, index);
    } catch (error) {
      console.error('Error converting text to audio:', error);
      throw error;
    }
};

module.exports = {
convertTextToAudio
}