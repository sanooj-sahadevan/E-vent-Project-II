import { loginVendor, registerVendor, verifyAndSaveVendor, vendorAddress, uploadDishes, findVendorByEmailService, uploadImage, editVendorService, findVendorById, uploadAuditorium, softDeleteDishService, findBookingDetails, chatServices, findFoodVendorById, findAuditoriumVendorById, findDishesById, findAuditoriumById, softDeleteAuditoriumService, messageService, } from "../Service/vendorService.js";
import { HttpStatus } from "../utils/httpStatus.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
export const register = async (req, res, next) => {
    try {
        const { vendorname, email, phone, password } = req.body;
        const proceedWithRegistration = async () => {
            try {
                const otp = otpGenerator();
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
            }
            catch (error) {
                console.error('Error during registration:', error.message);
                res.status(HttpStatus.BAD_REQUEST).json({ error: "Registration failed: " + error.message });
            }
        };
        await proceedWithRegistration();
    }
    catch (error) {
        next(error);
    }
};
export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        console.log(email, otp);
        const vendor = await findVendorByEmailService(email);
        console.log(vendor);
        if (!vendor) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor not found" });
            return;
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
        next(error);
    }
};
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { vendor, vendorToken } = await loginVendor(email, password);
        res.cookie("vendorToken", vendorToken);
        res.status(HttpStatus.OK).json({ vendor, vendorToken });
    }
    catch (error) {
        next(error);
    }
};
export const fetchAddress = async (req, res, next) => {
    try {
        console.log("vann ta");
        const vendorAddresses = await vendorAddress();
        console.log(vendorAddresses);
        res.status(HttpStatus.OK).json(vendorAddresses);
    }
    catch (error) {
        next(error);
    }
};
export const editVendorDetails = async (req, res, next) => {
    try {
        const vendorDetails = req.body;
        const file = req.file;
        let imageUrl;
        if (file) {
            imageUrl = await uploadImage(file);
        }
        const updatedVendor = await editVendorService(vendorDetails, imageUrl);
        res.status(200).json({ ...updatedVendor, imageUrl });
    }
    catch (error) {
        next(error);
    }
};
export const fetchVendorDetails = async (req, res, next) => {
    try {
        console.log('controller');
        const { vendorId } = req.params; // Extract vendorId from request params
        const vendor = await findVendorById(vendorId); // Fetch vendor details
        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" });
        }
        else {
            res.status(200).json(vendor);
        }
    }
    catch (error) {
        next(error);
    }
};
export const fetchdishes = async (req, res, next) => {
    try {
        const { dishesId } = req.params;
        const vendor = await findDishesById(dishesId);
        res.status(200).json(vendor);
    }
    catch (error) {
        next(error);
    }
};
export const fetchauditorium = async (req, res, next) => {
    try {
        const { auditoriumId } = req.params;
        const vendor = await findAuditoriumById(auditoriumId);
        res.status(200).json(vendor);
    }
    catch (error) {
        next(error);
    }
};
export const addDishes = async (req, res, next) => {
    try {
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
        await uploadDishes(vendorId, body, imageUrl);
        return res.status(400).json({ error: "Dishes not added: something went wrong" });
    }
    catch (error) {
        console.error("Error adding dishes: ", error);
        next(error);
    }
};
export const addAuditorium = async (req, res, next) => {
    try {
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
        next(error);
    }
};
export const fetchDetailsVendor = async (req, res, next) => {
    try {
        const { vendorId } = req.params;
        const vendor = await findVendorById(vendorId);
        res.status(200).json(vendor);
    }
    catch (error) {
        console.error('Error in fetchDetailsVendor:', error);
        next(error);
    }
};
export const fetchFoodDetails = async (req, res, next) => {
    try {
        const { vendorId } = req.params;
        const dishes = await findFoodVendorById(vendorId);
        if (!dishes || dishes.length === 0) {
            res.status(404).json({ message: "No dishes found for this vendor" });
        }
        else {
            console.log(dishes, 'Fetched dishes for vendor');
            res.status(200).json(dishes);
        }
    }
    catch (error) {
        console.error('Error in fetchFoodDetails:', error);
        next(error);
    }
};
export const fetchAuditoriumDetails = async (req, res, next) => {
    try {
        const { vendorId } = req.params;
        const auditorium = await findAuditoriumVendorById(vendorId);
        if (!auditorium || auditorium.length === 0) {
            res.status(404).json({ message: "No dishes found for this vendor" });
        }
        else {
            console.log(auditorium, 'Fetched dishes for vendor');
            res.status(200).json(auditorium);
        }
    }
    catch (error) {
        console.error('Error in fetchFoodDetails:', error);
        next(error);
    }
};
export const softDeleteDish = async (req, res, next) => {
    try {
        const { dishId } = req.params;
        if (!dishId) {
            return res.status(400).json({ message: 'Dish ID is missing' });
        }
        const updatedDish = await softDeleteDishService(dishId);
        res.status(200).json({ message: 'Dish deleted successfully', dish: updatedDish });
    }
    catch (error) {
        next(error);
    }
};
export const softDeleteAuditorium = async (req, res, next) => {
    try {
        const { auditoriumId } = req.params;
        if (!auditoriumId) {
            return res.status(400).json({ message: 'Auditorium ID is missing' });
        }
        const updatedAuditorium = await softDeleteAuditoriumService(auditoriumId);
        res.status(200).json({ message: 'Auditorium deleted successfully', auditorium: updatedAuditorium });
    }
    catch (error) {
        next(error);
    }
};
export const vendorBookingDetils = async (req, res, next) => {
    const { vendorId } = req.params;
    try {
        const booking = await findBookingDetails(vendorId);
        res.status(200).json(booking);
    }
    catch (error) {
        next(error);
    }
};
export const getUnreadMessagesCount = async (req, res, next) => {
    const vendorId = req.vendorId;
    try {
        if (!vendorId) {
            return res.status(400).json({ error: "Vendor ID is required" });
        }
        const chatServiceData = await chatServices({ vendorId });
        const chatIds = chatServiceData.map((chat) => chat._id);
        if (chatIds.length === 0) {
            return res.status(200).json({ unreadCount: 0 });
        }
        const unreadCount = await messageService({ chatIds, vendorId });
        res.status(200).json({ unreadCount });
    }
    catch (error) {
        next(error);
    }
};
