"use strict";
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
                Key: `posts/${Date.now()}_${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
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
