

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


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
