import { getAllVendors, registerUser, verifyOtpService, update, loginUser, editUser, generatePaymentHash, checkEmail, getAllDishes, getAllAuditorium, findVendorById, findAuditoriumVendorById, generatesendEmail, findAuditoriumById, finddishesById, addTransactionDetails, fetchbookingData, generateOtp, findFoodVendorById, findEvent, findBookingDetails, findchangePassword } from "../Service/userService.js";
import { HttpStatus } from '../utils/httpStatus.js';
export const register = async (req, res, next) => {
    try {
        const otp = generateOtp();
        await registerUser({
            username: req.body.username,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            otp,
            _id: undefined,
            address: "",
            state: "",
            pincode: 0,
            reviews: undefined,
            district: undefined
        });
        const sendMail = await generatesendEmail(req.body.email, otp);
        res.status(200).json("OTP sent to email and saved in the database.");
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await loginUser(email, password);
        res.cookie("token", token, {
            sameSite: 'strict',
            maxAge: 3600000,
        });
        res.status(HttpStatus.OK).json({ user, token });
    }
    catch (error) {
        next(error.message);
    }
};
export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await verifyOtpService(email, otp);
        res.status(HttpStatus.OK).json(result);
    }
    catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
};
export const vendorList = async (req, res, next) => {
    try {
        const vendors = await getAllVendors();
        res.status(HttpStatus.OK).json(vendors);
    }
    catch (error) {
        next(error);
    }
};
export const dishlist = async (req, res, next) => {
    try {
        const { vendorId } = req.query;
        const dishes = await getAllDishes(vendorId);
        res.status(HttpStatus.OK).json(dishes);
    }
    catch (error) {
        next(error);
    }
};
export const auditoriumlist = async (req, res, next) => {
    try {
        const { vendorId } = req.query;
        const auditorium = await getAllAuditorium(vendorId);
        res.status(HttpStatus.OK).json(auditorium);
    }
    catch (error) {
        next(error);
    }
};
export const forgottenPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const { user, otp } = await checkEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'OTP sent successfully', otp, email });
    }
    catch (error) {
        next(error.message);
    }
};
export const updatePassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await update(email, password);
        res.status(HttpStatus.OK).json({ message: "Password updated successfully", user });
    }
    catch (error) {
        next(error);
    }
};
export const editUserDetails = async (req, res, next) => {
    try {
        const userDetails = req.body;
        console.log('Request Body:', userDetails);
        const updatedUser = await editUser(userDetails);
        res.status(HttpStatus.OK).json(updatedUser);
    }
    catch (error) {
        next(error);
    }
};
export const fetchVendorDetails = async (req, res, next) => {
    try {
        const { vendorId, userId } = req.query;
        const result = await findVendorById(vendorId, userId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
export const fetchFoodDetails = async (req, res, next) => {
    try {
        const { vendorId } = req.params;
        const dishes = await findFoodVendorById(vendorId);
        res.status(200).json(dishes);
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
        const dishes = await findAuditoriumVendorById(vendorId);
        if (!dishes || dishes.length === 0) {
            res.status(200).json(null);
        }
        else {
            console.log('Fetched dishes for vendor:', dishes);
            res.status(200).json(dishes);
        }
    }
    catch (error) {
        console.error('Error in fetchFoodDetails:', error);
        next(error);
    }
};
export const fetchauditorium = async (req, res, next) => {
    try {
        console.log('controller  indo audi ');
        const { auditoriumId } = req.params;
        console.log(auditoriumId, '---------------------------------------------------------------------------------');
        const vendor = await findAuditoriumById(auditoriumId);
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
        console.log('dishes  indo audi ');
        const { dishesId } = req.params;
        console.log(dishesId, '---------------------------------------------------------------------------------');
        const vendor = await finddishesById(dishesId);
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
export const fetchBookedData = async (req, res, next) => {
    const { id } = req.params;
    try {
        console.log({ id });
        console.log('controler 1');
        const booking = await findEvent(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json(booking);
    }
    catch (error) {
        next(error);
    }
};
export const payment = async (req, res, next) => {
    try {
        const { txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6 } = req.body;
        // Validate mandatory fields
        if (!txnid || !amount || !productinfo || !username || !email || !udf1 || !udf2 || !udf3 || !udf4 || !udf5 || !udf6) {
            return res.status(400).send("Mandatory fields missing");
        }
        // Call the service to generate hash
        const hash = await generatePaymentHash({
            txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6
        });
        // Send the generated hash as response
        res.send({ hash });
    }
    catch (error) {
        next(error);
    }
};
export const addTransaction = async (req, res, next) => {
    try {
        const { PayUOrderId, email, status } = req.body;
        console.log({ PayUOrderId, email, status });
        const transactionId = await addTransactionDetails(email, PayUOrderId, status);
        res.status(200).send(transactionId);
    }
    catch (error) {
        next(error);
    }
};
export const saveData = async (req, res, next) => {
    try {
        const { txnid, email, productinfo, status, amount, udf1, udf2, udf3, udf4, udf5, udf6 } = req.body;
        const eventType = udf6;
        const userId = udf1;
        const auditoriumId = udf2;
        const dishesId = udf3;
        const date = udf4;
        const category = udf5;
        const vendorId = productinfo;
        console.log('Received udf6 (eventType):', udf6);
        if (status === "success") {
            const bookedTripId = await fetchbookingData({
                txnid,
                email,
                vendorId,
                status,
                amount,
                userId,
                auditoriumId,
                dishesId,
                date,
                eventType,
                category
            });
            console.log('Booking Data:', { txnid, email, vendorId, status, amount, userId, auditoriumId, dishesId, date, eventType, category });
            if (bookedTripId) {
                res.status(200).json({ success: true, bookedTripId: bookedTripId._id });
            }
            else {
                res.status(500).json({ success: false, message: "Booking update failed" });
            }
        }
        else {
            res.status(400).json({ success: false, message: "Booking failed" });
        }
    }
    catch (error) {
        next(error);
    }
};
export const fetchBookingDetails = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const booking = await findBookingDetails(userId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json(booking);
    }
    catch (error) {
        next(error);
    }
};
export const changePassword = async (req, res, next) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    console.log('chage password');
    try {
        const updatedPassword = await findchangePassword(id, newPassword);
        if (!updatedPassword) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedPassword);
    }
    catch (error) {
        next(error);
    }
};
