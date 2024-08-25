import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from "@aws-sdk/client-transcribe"

export default class TranscribeService {
    job_name
    region
    constructor(job_name, region) {
        this.job_name = job_name;
        this.region = region
    }

    getTranscribeStatus = async () => {
        const client = new TranscribeClient({ region: this.region });
        const input = {
            TranscriptionJobName: this.job_name
        };
        const command = new GetTranscriptionJobCommand(input);
        const response = await client.send(command);
        return response.TranscriptionJob.TranscriptionJobStatus; 
    }

    createTranscribeJob = async (bucket, fileName, outputFileName,) => {
        const client = new TranscribeClient({ region: this.region });
        const input = {
            TranscriptionJobName: this.job_name,
            LanguageCode: "en-US",
            MediaFormat: "mp4",
            Media: { 
                MediaFileUri: fileName,
            },
            OutputBucketName: bucket,
            OutputKey: outputFileName
        };
        const command = new StartTranscriptionJobCommand(input);
        const response = await client.send(command);
        return response;
    }
}
