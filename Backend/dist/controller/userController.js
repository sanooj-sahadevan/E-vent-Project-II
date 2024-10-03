import { 
// googleLogin,
getAllVendors, registerUser, verifyAndSaveUser, update, loginUser, editUser, checkEmail, getAllDishes, getAllAuditorium, findVendorById, findAuditoriumVendorById, findAuditoriumById, finddishesById, addTransactionDetails, fetchbookingData, findFoodVendorById, findEvent, findBookingDetails } from "../Service/userService.js";
import { findUserByEmail,
// findUserById,
 } from "../Repository/userReop.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { HttpStatus } from '../utils/httpStatus.js';
import jsSHA from 'jssha';
export const register = async (req, res, next) => {
    try {
        const { username, email, phone, password } = req.body;
        console.log({ username, email, phone, password });
        const proceedWithRegistration = async () => {
            try {
                const otp = otpGenerator();
                console.log(otp);
                await registerUser({
                    username,
                    phone,
                    email,
                    password, otp,
                    _id: undefined,
                    save: function () {
                        throw new Error("Function not implemented.");
                    },
                    address: "",
                    state: "",
                    pincode: 0,
                    reviews: undefined,
                    district: undefined
                });
                await sendEmail(email, otp);
                res.status(200).json("OTP sent to email");
            }
            catch (error) {
                next(error);
            }
        };
        await proceedWithRegistration();
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await loginUser(email, password);
        res.cookie("token", token, {
            sameSite: 'strict',
            maxAge: 3600000
        });
        res.status(HttpStatus.OK).json({ user, token });
    }
    catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
};
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(email, otp);
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: "User not found" });
        }
        console.log(user.otp, otp);
        if (user.otp === otp) {
            await verifyAndSaveUser(email, otp);
            res.status(HttpStatus.OK).json("User registered successfully");
        }
        else {
            res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
        }
    }
    catch (error) {
        next(Error);
    }
};
function next(Error) {
    throw new Error("Function not implemented.");
}
export const vendorList = async (req, res, next) => {
    try {
        console.log('list');
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
        console.log('Vendor ID:', vendorId);
        console.log('Fetching dishes list');
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
        console.log('Vendor ID:', vendorId);
        console.log('Fetching auditorium list');
        const auditorium = await getAllAuditorium(vendorId);
        res.status(HttpStatus.OK).json(auditorium);
    }
    catch (error) {
        next(error);
    }
};
export const forgottenPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const { user } = await checkEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const otp = otpGenerator();
        await sendEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully', otp, email });
        res.status(HttpStatus.OK).json({ message: 'OTP sent successfully', otp, email });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
};
export const updatePassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password + ' main content ithil ind');
        const user = await update(email, password);
        if (!user) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: "User not found" });
            return;
        }
        res.status(HttpStatus.OK).json({ message: "Password updated successfully", user });
    }
    catch (error) {
        next(error);
    }
};
// export class VendorController {
//     private vendorService: VendorService;
//     constructor() {
//         this.vendorService = new VendorService(); // Instantiate service in the constructor
//     }
//     // Fetch all vendors
//     public async getAllVendors(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try {
//             const vendors = await this.vendorService.getAllVendors(); // Call the service method
//             res.status(200).json(vendors); // Return vendors
//         } catch (error) {
//             next(error); // Handle error
//         }
//     }
// }
// export class userController {
//   private vendorService: VendorService;
//   constructor() {
//       this.vendorService = new VendorService(); // Instantiate service in the constructor
//   }
//   // Fetch all vendors
//   public async getAllVendors(req: Request, res: Response, next: NextFunction): Promise<void> {
//       try {
//           const vendors = await this.vendorService.getAllVendors(); // Call the service method
//           res.status(200).json(vendors); // Return vendors
//       } catch (error) {
//           next(error); // Handle error
//       }
//   }
// }
// // import { UserService } from '../Service/userService.js'; // Import the service
export const editUserDetails = async (req, res, next) => {
    try {
        console.log('Controller: Edit User Details');
        const userDetails = req.body;
        console.log('Request Body:', userDetails);
        const updatedUser = await editUser(userDetails);
        res.status(HttpStatus.OK).json(updatedUser);
    }
    catch (error) {
        console.error('Error in editUserDetails controller:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        next(error);
    }
};
export const fetchVendorDetails = async (req, res, next) => {
    try {
        console.log('controller: fetchVendorDetails');
        const { vendorId, userId } = req.query;
        if (!vendorId || !userId) {
            res.status(400).json({ message: "Missing vendorId or userId" });
            return;
        }
        const result = await findVendorById(vendorId, userId);
        if (!result.vendor) {
            res.status(404).json({ message: "Vendor not found" });
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (error) {
        next(error);
    }
};
export const fetchFoodDetails = async (req, res, next) => {
    try {
        console.log('Controller invoked');
        const { vendorId } = req.params;
        const dishes = await findFoodVendorById(vendorId);
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
export const fetchBookedData = async (req, res) => {
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
        console.error("Error fetching booking data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// PAYMENT
export const payment = async (req, res) => {
    try {
        console.log('hey paymeent');
        const { txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6 } = req.body;
        console.log({ txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6 });
        console.log('hey paymeent1');
        if (!txnid || !amount || !productinfo || !username || !email || !udf1 || !udf2 || !udf3 || !udf4 || !udf5 || !udf6) {
            res.status(400).send("Mandatory fields missing");
            return;
        }
        console.log('hey paymeent2');
        const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${username}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|||||${process.env.PAYU_SALT}`;
        console.log('hey paymeent3');
        const sha = new jsSHA("SHA-512", "TEXT");
        sha.update(hashString);
        const hash = sha.getHash("HEX");
        console.log('hash pokin');
        res.send({ hash: hash });
    }
    catch (error) {
        console.log("error payment:", error);
        res.status(500).send("Internal server error");
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
export const saveData = async (req, res) => {
    try {
        const { txnid, email, productinfo, status, amount, udf1, udf2, udf3, udf4, udf5, udf6 } = req.body;
        const eventType = udf6;
        // Map udf fields to meaningful names
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
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const fetchBookingDetails = async (req, res) => {
    const { userId } = req.params;
    try {
        const booking = await findBookingDetails(userId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json(booking);
    }
    catch (error) {
        console.error("Error fetching booking data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
