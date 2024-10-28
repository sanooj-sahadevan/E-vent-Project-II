
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
    const decoded: any = jwt.verify(vendorToken, secret) as { vendorId: string };
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

