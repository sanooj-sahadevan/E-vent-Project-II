import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { IMulterFile } from '../utils/type';
import AWS from 'aws-sdk';

export async function uploadToS3Bucket(p0: any[], file: IMulterFile): Promise<string> {
  try {
    console.log('s3');
    
    if (!file) {
      throw new Error("No file uploaded");
    }
    
    const params: any = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `posts/${Date.now()}_${file.originalname}`, 
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const s3 = new AWS.S3();

    const uploadedResult = await s3.upload(params).promise();

    if (!uploadedResult.Location) {
      throw new Error("Error grabbing image URL from S3 Bucket");
    }

    return uploadedResult.Location;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
