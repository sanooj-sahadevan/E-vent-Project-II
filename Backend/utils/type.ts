import { ReadStream } from 'fs';

export interface IMulterFile {
    path(vendorDetails: any, path: any): string | PromiseLike<string | undefined> | undefined;
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer; // For memory storage
    stream?: ReadStream; // Optional, used with disk storage
}
