
import { NextFunction, Request, Response } from "express";
import {
  loginVendor,
  registerVendor,
  //   uploadImage,
  //   uploadTrip,
  verifyAndSaveVendor,
} from "../Service/vendorService.js";


import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { findVendorByEmail } from "../Repository/vendorRepo.js";
import { HttpStatus } from "../utils/httpStatus.js";


export const register = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { vendorname, email, phone, password } = req.body;

   

    const proceedWithRegistration = async () => {
      try {
        const otp = otpGenerator();
        console.log(otp);

        await registerVendor({
          vendorname,
          phone,
          email,
          password,
          otp,
          // categories,
          // reviews,
        });

        await sendEmail(email, otp);

        res.status(HttpStatus.OK).json("OTP sent to email");
      } catch (error: any) {
        res
          .status(400)
          .json({ error: "Registration failed: " + error.message });
      }
    };

    proceedWithRegistration();
  } catch (error: any) {

};


export const verifyOtp =  async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);

    const vendor = await findVendorByEmail(email);
    console.log(vendor);

    if (!vendor) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: "vendor not found" });
    }

    if (vendor.otp === otp) {
      await verifyAndSaveVendor(email, otp);
      res.status(HttpStatus.OK).json("vendor registered successfully");
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
    }
  } catch (error: any) {

};

export const login =  async (req: Request, res: Response,next:NextFunction) => {
  try {
    
    const { email, password } = req.body;
    console.log(req.body);
    
    const { vendor, vendorToken } = await loginVendor(email, password);
    if (vendor) {
      res.cookie("vendorToken", vendorToken);
      res.status(HttpStatus.OK).json({ vendor, vendorToken });
    } else {
      res.status(HttpStatus.OK).json({ vendor });
    }
  } catch (error: any) {

  }
};