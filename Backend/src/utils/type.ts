
import { ReadStream } from 'fs';

export interface IMulterFile {
    path(vendorDetails: any, path: any): string | PromiseLike<string | undefined> | undefined;
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
    stream?: ReadStream;
}