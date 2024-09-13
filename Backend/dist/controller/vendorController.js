import { loginVendor, registerVendor, verifyAndSaveVendor, vendorAddress, editVendor } from "../Service/vendorService.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { findVendorByEmail } from "../Repository/vendorRepo.js";
import { HttpStatus } from "../utils/httpStatus.js";
// Controller for vendor registration
// Controller for vendor registration
export const register = async (req, res, next) => {
    try {
        const { vendorname, email, phone, password } = req.body;
        console.log(req.body, '');
        // Proceed with registration logic
        const proceedWithRegistration = async () => {
            try {
                const otp = otpGenerator(); // Generate OTP for the vendor
                console.log('Generated OTP:', otp);
                // Register the vendor with the required and optional fields
                await registerVendor({
                    vendorname,
                    phone,
                    email,
                    password,
                    otp, // Required OTP
                    reviews: "", // Default empty string
                    address: "", // Default empty address
                    district: "", // Default empty district
                    state: "" // Default empty state
                });
                // Send OTP to vendor's email
                await sendEmail(email, otp);
                res.status(HttpStatus.OK).json("OTP sent to email");
            }
            catch (error) {
                console.error('Error during registration:', error.message);
                res.status(HttpStatus.BAD_REQUEST).json({ error: "Registration failed: " + error.message });
            }
        };
        await proceedWithRegistration(); // Properly handle the async function
    }
    catch (error) {
        next(error); // Forward any unexpected errors to the error-handling middleware
    }
};
export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        console.log(email, otp);
        const vendor = await findVendorByEmail(email);
        console.log(vendor);
        if (!vendor) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor not found" });
            return; // Stop further execution after sending the response
        }
        if (vendor.otp === otp) {
            await verifyAndSaveVendor(email, otp);
            res.status(HttpStatus.OK).json("Vendor registered successfully");
        }
        else {
            res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
        }
    }
    catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const { vendor, vendorToken } = await loginVendor(email, password);
        if (vendor) {
            res.cookie("vendorToken", vendorToken, { httpOnly: true });
            res.status(HttpStatus.OK).json({ vendor, vendorToken });
        }
        else {
            res.status(HttpStatus.UNAUTHORIZED).json({ error: "Invalid email or password" }); // Respond with error if vendor not found
        }
    }
    catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: "Error: " + error.message }); // Corrected error message syntax
    }
};
export const fetchAddress = async (req, res, next) => {
    try {
        console.log("vann ta");
        const vendorAddresses = await vendorAddress();
        console.log(vendorAddresses);
        // Get addresses from service
        res.status(200).json(vendorAddresses); // Send response
    }
    catch (error) {
        next(error); // Pass error to the next middleware (error handler)
    }
};
;
// Edit vendor details
export const editVendorDetails = async (req, res, next) => {
    try {
        console.log('controller');
        const vendorDetails = req.body; // Get vendor details from the request body
        const updatedVendor = await editVendor(vendorDetails); // Call the service to update vendor details
        res.status(200).json(updatedVendor); // Send response with the updated vendor
    }
    catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};
