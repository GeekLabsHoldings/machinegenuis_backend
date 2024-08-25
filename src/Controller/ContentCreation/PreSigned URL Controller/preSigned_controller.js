import { error } from "console";
import S3_services from "../../../Service/AWS/S3_Bucket/presinedURL";
require('dotenv').config();


const getPreSignedURL = async (req , res) => {
    try 
    {
        const regionAWS = process.env.AWS_REGION;
        const bucketName = process.env.BUCKET_NAME;
        const fileName = `Movies/Movie_${Date.now()}.mp4`;
        const s3Serv = new S3_services()
        const preSignedURL = await s3Serv.createPresignedUrlWithClient({region:regionAWS, bucket: bucketName, key:fileName})

        
        return res
        .status(200)
        .json({message:"The URL created Suc." , preSignedURL , movieUrl: preSignedURL.split("?")[0] , s3BucketURL : `s3://machine-genius/${fileName}`});
    }
    catch(Error)
    {
        console.log(Error);
        
        return res.status(500).json({message:"Error cannot set presigned URL "});

    }
}


export { getPreSignedURL}