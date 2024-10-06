"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpGenerator = void 0;
const crypto_1 = __importDefault(require("crypto"));
// Function to generate an OTP
const otpGenerator = () => {
    return crypto_1.default.randomInt(1000, 9999).toString();
};
exports.otpGenerator = otpGenerator;
