import AWS from 'aws-sdk';
export async function uploadToS3Bucket(p0, file) {
    try {
        console.log('s3');
        if (!file) {
            throw new Error("No file uploaded");
        }
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `posts/${Date.now()}_${file.originalname}`, // Unique file name
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
    }
    catch (error) {
        throw new Error(error.message);
    }
}