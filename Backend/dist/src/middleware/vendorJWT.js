import jwt from "jsonwebtoken";
import { HttpStatus } from "../utils/httpStatus.js";
export function verifyvendor(req, res, next) {
    const vendorToken = req.cookies?.vendorToken;
    console.log(vendorToken);
    if (!vendorToken) {
        return res.status(HttpStatus.UNAUTHORIZED).send("JWT not found in the cookies");
    }
    const secret = process.env.JWT_SECRET || "";
    if (!secret) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("JWT secret not found in the env");
    }
    try {
        const decoded = jwt.verify(vendorToken, secret);
        req.vendorId = decoded?.vendorId;
        // if (!decoded?.role || decoded.role != "Travelie-company") {
        //   return res.status(401).send("Invalid JWT");
        // }
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(HttpStatus.UNAUTHORIZED).send("Invalid JWT");
    }
}
