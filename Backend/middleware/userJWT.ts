import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import UserModel from "../Repository/userReop.js"; // Adjust the import path if needed

// Verify JWT and user middleware
export async function verifyUser(req: Request, res: Response, next: NextFunction) {
  console.log('Verifying user...');

  const token = req.headers.authorization?.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!token) {
    console.log('toke error');

    return res.status(401).json("JWT token not found in the request");
  }

  if (!secret) {
    console.log('screte error');

    return res.status(500).json("JWT secret not found in the environment");
  }

  try {
    // Verify the JWT token
    // const decoded: any = jwt.verify(token, secret);
    // req.userId = decoded?.userId;
    // console.log('Decoded user ID:', req.userId);

    // // Fetch the user from the database using the decoded userId
    // const user = await UserModel.findById(req.userId);

    // Check if the user exists
    // if (!user) {
    //   console.log('usr error');

    //   return res.status(404).json("User not found");
    // }

    // // Check if the user is blocked
    // if (user.isBlocked) {
    //   console.log('blk error');

    //   return res.status(403).json("User is blocked");
    // }

    next();
  } catch (err: any) {
    console.log("JWT verification failed:", err.message);
    return res.status(401).json("Invalid or expired JWT");
  }
}
