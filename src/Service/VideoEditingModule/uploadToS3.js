const { getAudioDurationInSeconds } = require('get-audio-duration');
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");

const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });

const uploadToS3 = async (audioStream, index) => {
  const id = `${index}-${Date.now()}`
    try {
      const upload = new Upload({
        client: client,
        params: {
          Bucket: 'machine-genius',
          Key: `My_Audios/audio-${id}.mp3`,
          Body: audioStream,
          ContentType: 'audio/mpeg',
          ACL: "public-read",
        },
      });

      await upload.done();
      console.log(`Audio uploaded succ`)
      const audioUrl = `https://machine-genius.s3.amazonaws.com/My_Audios/audio-${id}.mp3`;
      const duration =  await getAudioDurationInSeconds(audioUrl);

      index = `${id}`
      return { index , url: audioUrl, duration:duration };
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
};

const overWriteToS3 = async (audioStream, index) => {
    try {
      const upload = new Upload({
        client: client,
        params: {
          Bucket: 'machine-genius',
          Key: `My_Audios/audio-${index}.mp3`,
          Body: audioStream,
          ContentType: 'audio/mpeg',
          ACL: "public-read",
        },
      });

      await upload.done();
      console.log(`Audio uploaded succ`)
      const audioUrl = `https://machine-genius.s3.amazonaws.com/My_Audios/audio-${index}.mp3`;
      // const duration =  await getAudioDurationInSeconds(audioUrl);
      return { index , url: audioUrl, duration:10 };
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
};

module.exports = {
    uploadToS3,
    overWriteToS3
}