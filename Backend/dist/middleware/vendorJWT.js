"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyvendor = verifyvendor;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatus_1 = require("../utils/httpStatus");
function verifyvendor(req, res, next) {
    var _a;
    const vendorToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.vendorToken;
    console.log(vendorToken);
    if (!vendorToken) {
        return res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).send("JWT not found in the cookies");
    }
    const secret = process.env.JWT_SECRET || "";
    if (!secret) {
        return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json("JWT secret not found in the env");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(vendorToken, secret);
        req.vendorId = decoded === null || decoded === void 0 ? void 0 : decoded.vendorId;
        // if (!decoded?.role || decoded.role != "Travelie-company") {
        //   return res.status(401).send("Invalid JWT");
        // }
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).send("Invalid JWT");
    }
}
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// export function verifyvendor(req: any, res: Response, next: NextFunction) {  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized, no token provided' });
//   }
//   try {
//     // Decode the token and extract vendorId (Assuming vendorId is part of token payload)
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { vendorId: string };
//     req.vendorId = decoded.vendorId; // Set the vendorId to the request object
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: 'Invalid or expired token' });
//   }
// };
