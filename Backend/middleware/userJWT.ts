import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyUser(req: any, res: Response, next: NextFunction) {
    console.log('1');
    
  const Token = req.cookies?.token;
    
  if (!Token) {
    console.log('1');

    return res.status(401).json("JWT not found in the cookies");
  }

  const secret = process.env.JWT_SECRET || "";
  if (!secret) {
    return res.status(500).json("JWT secret not found in the env");
  }

  try {
    const decoded: any = jwt.verify(Token, secret);
    req.userId = decoded?.userId;
    
    // if (!decoded?.role || decoded.role != "Travelie-company") {
    //   return res.status(401).send("Invalid JWT");
    // }
    
    next();
  } catch (err: any) {
    console.log(err);
    
    return res.status(401).send("Invalid JWT");
  }
}