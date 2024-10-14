const dotenv = require("dotenv");
import Ec2Service from "../../../Service/AWS/EC2";
import S3_services from "../../../Service/AWS/S3_Bucket/presinedURL";
import TranscribeService from "../../../Service/AWS/Transcribe/transcription";
const {recapContent} = require('../OpenAi Controllers/recapTranscript_controller');

dotenv.config();

const delay = async (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

const split = async function (data) {
  const segments = [];
  let currentSegment = "";
  let segmentEndTime = 150;
  let startTime = 0;
  let endTime = 0;
  let part = 0;

  for (const item of data) {
    if (item.start_time < segmentEndTime) {
      currentSegment += item.transcript + " ";
      endTime = item.end_time.split(".")[0];
    } else {
      part = part + 1;
      endTime = item.end_time.split(".")[0];

      const recappedContent = await recapContent(currentSegment);
      
      segments.push({
        part: part,
        "time duration": `${startTime}:${endTime}`,
        transcription: { content: recappedContent.content },
      });

      startTime = endTime;
      currentSegment = "";
      currentSegment += item.transcript + " ";
      segmentEndTime += 150;
    }
  }

  if (currentSegment.length > 0) {
    part = part + 1;

    const recappedContent = await recapContent(currentSegment);
    
    segments.push({
      part: part,
      "time duration": `${startTime}:${endTime}`,
      transcription: { content: recappedContent.content },
    });
  }

  return segments;
}

const convertor = async (req, res) => {
  try {
    const fileName = req.body.s3BucketURL;
    const jobName = `jobID_${Date.now()}`;
    const outputName = fileName.split("/")[4].split(".")[0];
    const bucket = process.env.BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const responseOutputName = `Transcript/${outputName}.json`;
    console.log(fileName);
    
    const transcribeService = new TranscribeService(jobName, region);
    const creatJob = await transcribeService.createTranscribeJob(
      bucket,
      fileName,
      responseOutputName
    );
    while (true) {
      const getStatus = await transcribeService.getTranscribeStatus();
      if (getStatus === "COMPLETED") {
        break;
      } else if (getStatus === "FAILED") {
        throw "FAILED OPERATION";
      } else await delay(5000);
    }
    const s3Sercive = new S3_services();
    const jsonData = await s3Sercive.getTranscriptFile({
      bucket,
      region,
      key: responseOutputName,
    });

    const transcriptionResults = await split(jsonData);
    return res.json({transcriptionResults});

  } catch (error) {
    return res.status(500).json({ error });
  }
};
  
export { convertor };