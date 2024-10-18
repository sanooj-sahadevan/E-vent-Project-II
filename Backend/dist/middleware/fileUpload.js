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
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
function uploadToS3Bucket(fileName, fileType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('s1 - Generating pre-signed URL for:', fileName, fileType);
            const s3Client = new client_s3_1.S3Client({
                region: process.env.AWS_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            });
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `posts/${Date.now()}_${fileName}`,
                ContentType: fileType
            };
            const command = new client_s3_1.PutObjectCommand(params);
            const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 300 });
            console.log('s4 - Presigned URL generated:', signedUrl);
            return signedUrl;
        }
        catch (error) {
            console.error('Error generating pre-signed URL:', error);
            throw new Error(error.message);
        }
    });
}
