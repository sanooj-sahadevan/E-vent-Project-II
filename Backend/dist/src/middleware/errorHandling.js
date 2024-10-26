import { HttpStatus } from "../utils/httpStatus.js";
export const errorHandler = (error, req, res, next) => {
    let errorMsg = error.message || 'An unexpected error occurred';
    if (errorMsg.includes("E11000") || errorMsg.includes("duplicate key error")) {
        console.error(error);
        return res.status(HttpStatus.BAD_REQUEST).send("Credentials already exist");
    }
    console.log(errorMsg);
    res.status(HttpStatus.BAD_REQUEST).send(errorMsg);
};
