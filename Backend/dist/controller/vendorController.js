import { loginVendor, registerVendor, verifyAndSaveVendor, vendorAddress, uploadDishes, uploadImage, editVendor, findVendorById, uploadAuditorium, findFoodVendorById, findAuditoriumVendorById, findDishesById, findAuditoriumById } from "../Service/vendorService.js";
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
        // if (vendor) {
        // } else {
        //   res.status(HttpStatus.UNAUTHORIZED).json({ error: "Invalid email or password" }); // Respond with error if vendor not found
        // }
        res.cookie("vendorToken", vendorToken);
        res.status(HttpStatus.OK).json({ vendor, vendorToken });
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
        res.status(HttpStatus.OK).json(vendorAddresses); // Send response
    }
    catch (error) {
        next(error); // Pass error to the next middleware (error handler)
    }
};
;
// Edit vendor details
// import { editVendor } from '../services/vendorService'; // Adjust the import path as needed
export const editVendorDetails = async (req, res, next) => {
    try {
        console.log('controller');
        const vendorDetails = req.body;
        const file = req.file; // Single file upload
        let imageUrl;
        if (file) {
            imageUrl = await uploadImage(file); // Upload image and get the URL
        }
        // Pass both vendor details and image URL to the service
        const updatedVendor = await editVendor(vendorDetails, imageUrl);
        res.status(200).json({ ...updatedVendor, imageUrl }); // Include imageUrl if available
    }
    catch (error) {
        next(error); // Pass error to the error handler middleware
    }
};
;
export const fetchVendorDetails = async (req, res, next) => {
    try {
        console.log('controller');
        const { vendorId } = req.params; // Extract vendorId from request params
        const vendor = await findVendorById(vendorId); // Fetch vendor details
        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" });
        }
        else {
            res.status(200).json(vendor); // Return vendor details
        }
    }
    catch (error) {
        next(error); // Pass error to error handler middleware
    }
};
export const fetchdishes = async (req, res, next) => {
    try {
        console.log('controller');
        const { dishesId } = req.params; // Extract vendorId from request params
        const vendor = await findDishesById(dishesId); // Fetch vendor details
        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" });
        }
        else {
            res.status(200).json(vendor); // Return vendor details
        }
    }
    catch (error) {
        next(error); // Pass error to error handler middleware
    }
};
export const fetchauditorium = async (req, res, next) => {
    try {
        console.log('controller  indo audi ');
        const { auditoriumId } = req.params;
        console.log(auditoriumId, '---------------------------------------------------------------------------------');
        const vendor = await findAuditoriumById(auditoriumId); // Fetch vendor details
        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" });
        }
        else {
            res.status(200).json(vendor); // Return vendor details
        }
    }
    catch (error) {
        next(error); // Pass error to error handler middleware
    }
};
export const addDishes = async (req, res) => {
    try {
        const { body } = req;
        const vendorId = req.vendorId;
        console.log(vendorId, 'llllllllllllllllllllll');
        // Check if vendorId is undefined
        if (!vendorId) {
            return res.status(400).json({ error: "Vendor ID is required" });
        }
        const file = req.file; // Single file upload
        let imageUrl = undefined; // Initialize as `undefined`
        if (file) {
            imageUrl = await uploadImage(file);
        }
        // Passing the vendorId and body to the service function
        const dishesData = await uploadDishes(vendorId, body, imageUrl);
        if (dishesData) {
            return res.status(200).json("Dishes added successfully");
        }
        else {
            return res.status(400).json({ error: "Dishes not added: something went wrong" });
        }
    }
    catch (error) {
        console.error("Error adding dishes: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
export const addAuditorium = async (req, res) => {
    try {
        console.log('1');
        const { body } = req;
        const vendorId = req.vendorId;
        if (!vendorId) {
            return res.status(400).json({ error: "Vendor ID is required" });
        }
        const file = req.file;
        let imageUrl = undefined;
        if (file) {
            imageUrl = await uploadImage(file);
        }
        const auditoriumData = await uploadAuditorium(vendorId, body, imageUrl);
        if (auditoriumData) {
            return res.status(200).json("Auditorium added successfully");
        }
        else {
            return res.status(400).json({ error: "Auditorium not added: something went wrong" });
        }
    }
    catch (error) {
        console.error("Error adding auditorium: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
// Ensure the function name is consistent
export const fetchDetailsVendor = async (req, res, next) => {
    try {
        console.log('Controller invoked');
        const { vendorId } = req.params;
        const vendor = await findVendorById(vendorId);
        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" });
        }
        else {
            console.log(vendor, 'bdhewbfew ');
            res.status(200).json(vendor);
        }
    }
    catch (error) {
        console.error('Error in fetchDetailsVendor:', error);
        next(error);
    }
};
export const fetchFoodDetails = async (req, res, next) => {
    try {
        console.log('Controller invoked');
        const { vendorId } = req.params;
        const dishes = await findFoodVendorById(vendorId); // Fetch dishes for the vendor
        if (!dishes || dishes.length === 0) {
            res.status(404).json({ message: "No dishes found for this vendor" });
        }
        else {
            console.log(dishes, 'Fetched dishes for vendor');
            res.status(200).json(dishes); // Return the array of dishes
        }
    }
    catch (error) {
        console.error('Error in fetchFoodDetails:', error);
        next(error);
    }
};
export const fetchAuditoriumDetails = async (req, res, next) => {
    try {
        console.log('Controller invoked');
        const { vendorId } = req.params;
        const auditorium = await findAuditoriumVendorById(vendorId); // Fetch dishes for the vendor
        if (!auditorium || auditorium.length === 0) {
            res.status(404).json({ message: "No dishes found for this vendor" });
        }
        else {
            console.log(auditorium, 'Fetched dishes for vendor');
            res.status(200).json(auditorium); // Return the array of dishes
        }
    }
    catch (error) {
        console.error('Error in fetchFoodDetails:', error);
        next(error);
    }
};
