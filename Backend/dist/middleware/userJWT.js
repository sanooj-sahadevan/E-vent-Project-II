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
exports.verifyUser = verifyUser;
const httpStatus_1 = require("../utils/httpStatus");
// import UserModel from "../Repository/userReop.js"; // Adjust the import path if needed
// Verify JWT and user middleware
function verifyUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log('Verifying user...');
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const secret = process.env.JWT_SECRET;
        if (!token) {
            console.log('toke error');
            return res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json("JWT token not found in the request");
        }
        if (!secret) {
            console.log('screte error');
            return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json("JWT secret not found in the environment");
        }
        try {
            // Verify the JWT token
            // const decoded: any = jwt.verify(token, secret);
            // req.userId = decoded?.userId;
            // console.log('Decoded user ID:', req.userId);
            // // Fetch the user from the database using the decoded userId
            // const user = await UserModel.findById(req.userId);
            // Check if the user exists
            // if (!user) {
            //   console.log('usr error');
            //   return res.status(404).json("User not found");
            // }
            // // Check if the user is blocked
            // if (user.isBlocked) {
            //   console.log('blk error');
            //   return res.status(403).json("User is blocked");
            // }
            next();
        }
        catch (err) {
            return res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json("Invalid or expired JWT");
        }
    });
}
