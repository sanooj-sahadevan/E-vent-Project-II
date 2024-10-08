// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { IMulterFile } from '../utils/type';  
// export async function uploadToS3Bucket(p0: any[], file: IMulterFile): Promise<string> {
//   try {
//     if (!file) {
//       throw new Error("No file uploaded");
//     }

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

//     const s3Client = new S3Client({
//       region: process.env.AWS_REGION,
//       credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//       },
//     });

//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME!,
//       Key: `posts/${Date.now()}_${file.originalname}`, 
//       Body: file.buffer,                               
//       ContentType: file.mimetype,                      
//     };

//     // Upload file to S3 bucket
//     const command = new PutObjectCommand(params);
//     const uploadResult = await s3Client.send(command);

//     // Manually constructing the file URL using the bucket and key
//     const uploadedFileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    
//     return uploadedFileUrl;
//   } catch (error: any) {
//     console.error('Error uploading file to S3:', error);
//     throw new Error(error.message);
//   }
// }





export async function uploadToS3Bucket(fileName: string, fileType: string): Promise<string> {
  try {
    console.log('s1 - Generating pre-signed URL for:', fileName, fileType);
    
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `posts/${Date.now()}_${fileName}`, 
      ContentType: fileType
    };

    const command = new PutObjectCommand(params);

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); 
    console.log('s4 - Presigned URL generated:', signedUrl);

    return signedUrl;
  } catch (error: any) {
    console.error('Error generating pre-signed URL:', error);
    throw new Error(error.message);
  }
}
