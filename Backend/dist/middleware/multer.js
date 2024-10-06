"use strict";
// import multer from 'multer';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const storage = multer.memoryStorage(); // Store files in memory
// const upload = multer({ storage: storage });
// export default upload;
const multer_1 = __importDefault(require("multer"));
console.log('1 multeer');
const storage = multer_1.default.memoryStorage();
console.log('loooo');
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
