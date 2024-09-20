import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyUser(req: any, res: Response, next: NextFunction) {
  console.log('Verifying user...');

  if (!req.cookies) {
    console.log("No cookies found in the request");
    return res.status(401).json("No cookies found in the request");
  }
  console.log("Cookies: ", req.cookies);

  const Token = req.cookies.token;
  console.log("Token from cookies:", Token);

  if (!Token) {
    console.log("JWT token not found in cookies");
    return res.status(401).json("JWT not found in the cookies");
  }

  const secret = process.env.JWT_SECRET || "";
  if (!secret) {
    return res.status(500).json("JWT secret not found in the environment");
  }

  try {
    const decoded: any = jwt.verify(Token, secret);
    req.userId = decoded?.userId;

    next();
  } catch (err: any) {
    console.log("JWT verification failed:", err);
    return res.status(401).send("Invalid JWT");
  }
}
