"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const VendorSchema = new mongoose_1.Schema({
    reviewsID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Reviews", default: null },
    vendorname: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: [true, 'Password is required'], select: false },
    profileImage: { type: String, default: '' },
    adminVerified: { type: Boolean, default: false },
    otp: { type: String, required: false },
    otpVerified: { type: Boolean, default: false },
    description: { type: String, default: '' },
    address: { type: String, default: '' },
    district: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    state: { type: String, default: '' },
    isBlocked: { type: Boolean, default: false, },
    serviceImages: { type: [String], default: [] },
});
exports.VendorModel = mongoose_1.default.model("Vendor", VendorSchema);
