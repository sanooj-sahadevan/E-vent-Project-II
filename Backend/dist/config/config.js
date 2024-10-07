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
exports.connectToMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.DB_CONNECTION_STRING, {
            serverSelectionTimeoutMS: 30000,
        });
        console.log('Successfully connected to MongoDB Atlas');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
    mongoose_1.default.connection.on('connected', () => {
        console.log('Mongoose connected to DB');
    });
    mongoose_1.default.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
    });
    mongoose_1.default.connection.on('disconnected', () => {
        console.log('Mongoose disconnected from DB');
    });
    // Handle application termination (for example, when Ctrl+C is pressed)
    process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        console.log('Mongoose connection closed due to app termination');
        process.exit(0); // Graceful exit
    }));
});
exports.connectToMongoDB = connectToMongoDB;
