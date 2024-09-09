import { loginVendor, registerVendor, 
//   uploadImage,
//   uploadTrip,
verifyAndSaveVendor, } from "../Service/vendorService.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { findVendorByEmail } from "../Repository/vendorRepo.js";

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
            }
            catch (error) {
                res
                    .status(400)
                    .json({ error: "Registration failed: " + error.message });
            }
        };
        proceedWithRegistration();
    }
    catch (error) {

    }
};
export const verifyOtp = async (req, res, next) => {
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
        }
        else {
            res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
        }
    }
    catch (error) {

    }
};
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const { vendor, vendorToken } = await loginVendor(email, password);
        if (vendor) {
            res.cookie("vendorToken", vendorToken);
            res.status(HttpStatus.OK).json({ vendor, vendorToken });
        }
        else {
            res.status(HttpStatus.OK).json({ vendor });
        }
    }
    catch (error) {

    }
};
