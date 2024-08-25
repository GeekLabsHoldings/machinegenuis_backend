import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl, S3RequestPresigner } from "@aws-sdk/s3-request-presigner";

class S3_services {

    /////methods////
    createPresignedUrlWithClient = async ({ region, bucket, key }) => {
        const client = new S3Client({ region });
        const command = new PutObjectCommand({ Bucket: bucket, Key: key, ACL: 'public-read-write' });
        return await getSignedUrl(client, command, { expiresIn: 360000 });
    };

    getTranscriptFile = async ({ region, bucket, key }) => {
        const client = new S3Client({ region });
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        const response = await client.send(command);
        const stringData = await response.Body?.transformToString();
        const jsonData = JSON.parse(stringData)
        return  jsonData.results?.audio_segments;
    }
}

export default S3_services





