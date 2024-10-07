"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const httpStatus_1 = require("../utils/httpStatus");
const errorHandler = (error, req, res, next) => {
    let errorMsg = error.message || 'An unexpected error occurred';
    if (errorMsg.includes("E11000") || errorMsg.includes("duplicate key error")) {
        console.error(error);
        return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).send("Credentials already exist");
    }
    console.log(errorMsg);
    res.status(httpStatus_1.HttpStatus.BAD_REQUEST).send(errorMsg);
};
exports.errorHandler = errorHandler;
