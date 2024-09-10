import { NextFunction, Request, Response } from "express";
import {
  loginVendor,
  registerVendor,
  verifyAndSaveVendor,vendorAddress
} from "../Service/vendorService.js";

import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { findVendorByEmail } from "../Repository/vendorRepo.js";
import { HttpStatus } from "../utils/httpStatus.js";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
          reviews: "",
          address: "",
          district: "",
          state: ""
        });

        await sendEmail(email, otp);

        res.status(HttpStatus.OK).json("OTP sent to email");
      } catch (error: any) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: "Registration failed: " + error.message });
      }
    };

    await proceedWithRegistration(); // Added `await` to handle the async function properly
  } catch (error: any) {
    next(error); // Forward the error to the error-handling middleware
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);

    const vendor = await findVendorByEmail(email);
    console.log(vendor);

    if (!vendor) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor not found" });
      return;  // Stop further execution after sending the response
    }

    if (vendor.otp === otp) {
      await verifyAndSaveVendor(email, otp);
      res.status(HttpStatus.OK).json("Vendor registered successfully");
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
    }
  } catch (error: any) {
    next(error); // Pass the error to the error-handling middleware
  }
};


export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const { vendor, vendorToken } = await loginVendor(email, password);

    if (vendor) {
      res.cookie("vendorToken", vendorToken, { httpOnly: true });
      res.status(HttpStatus.OK).json({ vendor, vendorToken });
    } else {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: "Invalid email or password" }); // Respond with error if vendor not found
    }
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: "Error: " + error.message }); // Corrected error message syntax
  }
};



export const fetchAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("vann ta");
    
    const vendorAddresses = await vendorAddress(); 
    console.log(vendorAddresses);
    
    // Get addresses from service
    res.status(200).json(vendorAddresses); // Send response
  } catch (error) {
    next(error); // Pass error to the next middleware (error handler)
  }
};
