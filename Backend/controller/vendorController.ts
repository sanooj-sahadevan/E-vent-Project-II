
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

        res.status(200).json("OTP sent to email");
      } catch (error: any) {
        res
          .status(400)
          .json({ error: "Registration failed: " + error.message });
      }
    };

    proceedWithRegistration();
  } catch (error: any) {
    next(error);   }
};


export const verifyOtp =  async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);

    const vendor = await findVendorByEmail(email);
    console.log(vendor);

    if (!vendor) {
      return res.status(404).json({ error: "vendor not found" });
    }

    if (vendor.otp === otp) {
      await verifyAndSaveVendor(email, otp);
      res.status(200).json("vendor registered successfully");
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error: any) {
    next(error);   }
};

export const login =  async (req: Request, res: Response,next:NextFunction) => {
  try {
    
    const { email, password } = req.body;
    console.log(req.body);
    
    const { vendor, vendorToken } = await loginVendor(email, password);
    if (vendor) {
      res.cookie("vendorToken", vendorToken);
      res.status(200).json({ vendor, vendorToken });
    } else {
      res.status(200).json({ vendor });
    }
  } catch (error: any) {
    next(error);   
  }
};