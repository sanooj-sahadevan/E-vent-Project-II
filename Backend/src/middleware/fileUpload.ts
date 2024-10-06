// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import AWS from 'aws-sdk';
// import { IMulterFile } from '../utils/type';

// export async function uploadToS3Bucket(p0: any[], file: IMulterFile): Promise<string> {
//   try {
//     console.log('s3');
    
//     if (!file) {
//       throw new Error("No file uploaded");
//     }
    
//     const params: any = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: `posts/${Date.now()}_${file.originalname}`, 
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     AWS.config.update({
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//       region: process.env.AWS_REGION,
//     });

//     const s3 = new AWS.S3();

//     const uploadedResult = await s3.upload(params).promise();

//     if (!uploadedResult.Location) {
//       throw new Error("Error grabbing image URL from S3 Bucket");
//     }

//     return uploadedResult.Location;
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// }


import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { IMulterFile } from '../utils/type.js';  
export async function uploadToS3Bucket(p0: any[], file: IMulterFile): Promise<string> {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `posts/${Date.now()}_${file.originalname}`,  // File key or name in S3 bucket
      Body: file.buffer,                               // File data (from multer)
      ContentType: file.mimetype,                      // MIME type of the file
    };

    // Upload file to S3 bucket
    const command = new PutObjectCommand(params);
    const uploadResult = await s3Client.send(command);

    // Manually constructing the file URL using the bucket and key
    const uploadedFileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    
    return uploadedFileUrl;
  } catch (error: any) {
    console.error('Error uploading file to S3:', error);
    throw new Error(error.message);
  }
}
