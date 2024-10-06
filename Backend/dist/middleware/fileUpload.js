"use strict";
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import AWS from 'aws-sdk';
// import { IMulterFile } from '../utils/type';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3Bucket = uploadToS3Bucket;
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
const client_s3_1 = require("@aws-sdk/client-s3");
function uploadToS3Bucket(p0, file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!file) {
                throw new Error("No file uploaded");
            }
            const s3Client = new client_s3_1.S3Client({
                region: process.env.AWS_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            });
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `posts/${Date.now()}_${file.originalname}`, // File key or name in S3 bucket
                Body: file.buffer, // File data (from multer)
                ContentType: file.mimetype, // MIME type of the file
            };
            // Upload file to S3 bucket
            const command = new client_s3_1.PutObjectCommand(params);
            const uploadResult = yield s3Client.send(command);
            // Manually constructing the file URL using the bucket and key
            const uploadedFileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
            return uploadedFileUrl;
        }
        catch (error) {
            console.error('Error uploading file to S3:', error);
            throw new Error(error.message);
        }
    });
}
