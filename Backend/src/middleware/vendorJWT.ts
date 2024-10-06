
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatus } from "../utils/httpStatus";

export function verifyvendor(req: any, res: Response, next: NextFunction) {
    
  const vendorToken = req.cookies?.vendorToken
    console.log(vendorToken);
    
  if (!vendorToken) {
    return res.status(HttpStatus.UNAUTHORIZED).send("JWT not found in the cookies");
  }

  const secret = process.env.JWT_SECRET || "";
  if (!secret) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("JWT secret not found in the env");
  }

  try {
    const decoded: any = jwt.verify(vendorToken, secret);
    req.vendorId = decoded?.vendorId;
    
    // if (!decoded?.role || decoded.role != "Travelie-company") {
    //   return res.status(401).send("Invalid JWT");
    // }
    
    next();
  } catch (err: any) {
    console.log(err);
    
    return res.status(HttpStatus.UNAUTHORIZED).send("Invalid JWT");
  }
}
