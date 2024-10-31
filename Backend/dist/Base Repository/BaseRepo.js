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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseRepo = exports.BaseRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
const vendorModel_1 = __importDefault(require("../models/vendorModel"));
const auditoriumModel_1 = require("../models/auditoriumModel");
const dishesModel_1 = require("../models/dishesModel");
class BaseRepository {
    constructor(userModel, vendorModel, adminModel, chatModel) {
        this.userModel = userModel;
        this.vendorModel = vendorModel;
        this.adminModel = adminModel;
        this.chatModel = chatModel;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.vendorModel.find().sort({ createdAt: -1 }).exec();
            }
            catch (error) {
                throw new Error(`Error fetching records from the database: ${error}`);
            }
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new userModel_1.default(user);
                return yield newUser.save();
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    userByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('234567890');
                const user = yield userModel_1.default.findOne({ email, isBlocked: false }).exec();
                return user;
            }
            catch (error) {
                console.error('Error finding user by email:', error);
                throw new Error('Database Error');
            }
        });
    }
    userById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return userModel_1.default.findById(userId);
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    updateUserBase(email, update) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return userModel_1.default.findOneAndUpdate({ email }, update, { new: true });
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    fetchAuditorium(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(vendorId);
            return yield auditoriumModel_1.Auditorium.findById(objectId);
        });
    }
    findVendorBase(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vendorModel_1.default.findById(vendorId);
        });
    }
    // async updateBookingStatus(bookingData: any) {
    //     const newBooking = await bookedModel.create({ ...bookingData });
    //     return newBooking;
    // }
    dishesById(dishesId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Entering Base Repository Layer");
                const result = yield dishesModel_1.Dishes.findById(dishesId);
                console.log('Result:', result);
                return result;
            }
            catch (error) {
                throw new Error(`Database Error - Fetching dish: ${error}`);
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
exports.baseRepo = new BaseRepository(userModel_1.default, vendorModel_1.default, adminModel_1.default, chatModel_1.default);
