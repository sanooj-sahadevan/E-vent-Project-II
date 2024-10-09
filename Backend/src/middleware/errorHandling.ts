import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../utils/httpStatus";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    let errorMsg = error.message || 'An unexpected error occurred';
    if (errorMsg.includes("E11000") || errorMsg.includes("duplicate key error")) {
        console.error(error)
        return res.status(HttpStatus.BAD_REQUEST).send("Credentials already exist");
    }
    console.log(errorMsg)
    res.status(HttpStatus.BAD_REQUEST).send(errorMsg);
}
