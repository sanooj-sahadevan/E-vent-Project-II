
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyvendor(req: any, res: Response, next: NextFunction) {
    
  const vendorToken = req.cookies?.vendorToken;
    
  if (!vendorToken) {
    return res.status(401).send("JWT not found in the cookies");
  }

  const secret = process.env.JWT_SECRET || "";
  if (!secret) {
    return res.status(500).json("JWT secret not found in the env");
  }

  try {
    const decoded: any = jwt.verify(vendorToken, secret);
    req.vendorId = decoded?.vendorId;
    
    
    
    next();
  } catch (err: any) {
    console.log(err);
    
    return res.status(401).send("Invalid JWT");
  }
}
