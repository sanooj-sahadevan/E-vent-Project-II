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
exports.bookedModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    vendorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    dishesId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Dishes",
        required: false
    },
    auditoriumId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Auditorium",
        required: false
    },
    eventType: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    category: {
        type: String,
        required: false
    },
    occupancy: {
        type: Number,
        required: false
    },
    totalAmount: {
        type: Number,
        required: false
    },
    paymentType: {
        type: String,
        default: "online"
    },
    paymentStatus: {
        type: String,
        required: false, default: "pending"
    },
    txnId: {
        type: String,
        default: null
    },
    StartingDate: {
        type: Date,
        required: false
    },
    EndingDate: {
        type: Date,
        required: false
    }
}, { timestamps: true });
exports.bookedModel = mongoose_1.default.model("Booked", bookingSchema);
