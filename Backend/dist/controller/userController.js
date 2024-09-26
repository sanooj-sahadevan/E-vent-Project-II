import { 
// googleLogin,
getAllVendors, registerUser, verifyAndSaveUser, update, loginUser, editUser, checkEmail, getAllDishes, getAllAuditorium, findVendorById, findAuditoriumVendorById, findAuditoriumById, finddishesById, addTransactionDetails, fetchbookingData, findFoodVendorById, findEvent } from "../Service/userService.js";
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
// infooo
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
        const { txnid, amount, productinfo, username, email } = req.body;
        console.log({ txnid, amount, productinfo, username, email });
        if (!txnid || !amount || !productinfo || !username || !email) {
            res.status(400).send("Mandatory fields missing");
            return;
        }
        // console.log({ process.env.PAYU_MERCHANT_KEY, PAYU_SALT, txnid });
        const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${username}|${email}|||||||||||${process.env.PAYU_SALT}`;
        const sha = new jsSHA("SHA-512", "TEXT");
        sha.update(hashString);
        const hash = sha.getHash("HEX");
        res.send({ hash: hash });
    }
    catch (error) {
        console.log("error payment:", error);
        res.status(500).send("Internal server error");
    }
};
export const addTransaction = async (req, res, next) => {
    try {
        console.log('add transactionnnnnnnnnnnnnnnnnnnnnnnnnn');
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
        console.log("save data   payament");
        const { txnid, email, productinfo, status } = req.body;
        console.log({ txnid, email, productinfo, status });
        if (status === "success") {
            const bookedTripId = await fetchbookingData(txnid, productinfo, status);
            console.log({ bookedTripId });
            if (bookedTripId) {
                res.status(200).json({ success: true, bookedTripId: bookedTripId._id });
            }
            else {
                res.status(500).json({ success: false, message: "Booking update failed" });
            }
        }
        else if (status === "failure") {
            res.status(400).json({ success: false, message: "Booking failed" });
        }
        else {
            res.status(400).json({ success: false, message: "Unknown status" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
//Chat
