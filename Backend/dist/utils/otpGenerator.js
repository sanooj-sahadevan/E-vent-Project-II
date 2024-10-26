"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpGenerator = void 0;
const crypto_1 = __importDefault(require("crypto"));
const otpGenerator = () => {
    let otp = crypto_1.default.randomInt(1000, 9999).toString();
    console.log(otp, '--');
    return otp;
};
exports.otpGenerator = otpGenerator;
