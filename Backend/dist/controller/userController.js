"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_js_1 = __importDefault(require("../Service/userService.js"));
const otpGenerator_js_1 = require("../utils/otpGenerator.js");
const sendEmail_js_1 = require("../utils/sendEmail.js");
const httpStatus_js_1 = require("../utils/httpStatus.js");
exports.default = {
    login: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const { user, token } = yield userService_js_1.default.loginUser(email, password);
            res.cookie("token", token, {
                sameSite: 'strict',
                maxAge: 3600000,
            });
            res.status(httpStatus_js_1.HttpStatus.OK).json({ user, token });
        }
        catch (error) {
            next(error.message);
        }
    }),
    verifyOtp: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, otp } = req.body;
            const result = yield userService_js_1.default.verifyOtpService(email, otp);
            res.status(httpStatus_js_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            res.status(httpStatus_js_1.HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }),
    vendorList: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendors = yield userService_js_1.default.getAllVendors();
            res.status(httpStatus_js_1.HttpStatus.OK).json(vendors);
        }
        catch (error) {
            next(error);
        }
    }),
    dishlist: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { vendorId } = req.query;
            const dishes = yield userService_js_1.default.getAllDishes(vendorId);
            res.status(httpStatus_js_1.HttpStatus.OK).json(dishes);
        }
        catch (error) {
            next(error);
        }
    }),
    auditoriumlist: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { vendorId } = req.query;
            const auditorium = yield userService_js_1.default.getAllAuditorium(vendorId);
            res.status(httpStatus_js_1.HttpStatus.OK).json(auditorium);
        }
        catch (error) {
            next(error);
        }
    }),
    forgottenPassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const { user, otp } = yield userService_js_1.default.checkEmail(email);
            if (!user) {
                return res.status(httpStatus_js_1.HttpStatus.NOT_FOUND).json({ error: 'User not found' });
            }
            res.status(httpStatus_js_1.HttpStatus.OK).json({ message: 'OTP sent successfully', otp, email });
        }
        catch (error) {
            next(error.message);
        }
    }),
    updatePassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield userService_js_1.default.update(email, password);
            res.status(httpStatus_js_1.HttpStatus.OK).json({ message: "Password updated successfully", user });
        }
        catch (error) {
            next(error);
        }
    }),
    editUserDetails: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userDetails = req.body;
            console.log('Request Body:', userDetails);
            const updatedUser = yield userService_js_1.default.editUser(userDetails);
            res.status(httpStatus_js_1.HttpStatus.OK).json(updatedUser);
        }
        catch (error) {
            next(error);
        }
    }),
    fetchVendorDetails: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { vendorId, userId } = req.query;
            const result = yield userService_js_1.default.findVendorById(vendorId, userId);
            res.status(httpStatus_js_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            next(error);
        }
    }),
    fetchFoodDetails: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { vendorId } = req.params;
            const dishes = yield userService_js_1.default.findFoodVendorById(vendorId);
            res.status(httpStatus_js_1.HttpStatus.OK).json(dishes);
        }
        catch (error) {
            console.error('Error in fetchFoodDetails:', error);
            next(error);
        }
    }),
    fetchAuditoriumDetails: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Controller invoked');
            const { vendorId } = req.params;
            const dishes = yield userService_js_1.default.findAuditoriumVendorById(vendorId);
            res.status(httpStatus_js_1.HttpStatus.OK).json(dishes);
        }
        catch (error) {
            console.error('Error in fetchFoodDetails:', error);
            next(error);
        }
    }),
    fetchauditorium: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { auditoriumId } = req.params;
            const vendor = yield userService_js_1.default.findAuditoriumById(auditoriumId);
            res.status(httpStatus_js_1.HttpStatus.OK).json(vendor);
        }
        catch (error) {
            next(error);
        }
    }),
    fetchdishes: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { dishesId } = req.params;
            const vendor = yield userService_js_1.default.finddishesById(dishesId);
            res.status(httpStatus_js_1.HttpStatus.OK).json(vendor);
        }
        catch (error) {
            next(error);
        }
    }),
    fetchBookedData: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const booking = yield userService_js_1.default.findEvent(id);
            res.status(httpStatus_js_1.HttpStatus.OK).json(booking);
        }
        catch (error) {
            next(error);
        }
    }),
    payment: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6 } = req.body;
            if (!txnid || !amount || !productinfo || !username || !email || !udf1 || !udf2 || !udf3 || !udf4 || !udf5 || !udf6) {
                return res.status(400).send("Mandatory fields missing");
            }
            const hash = yield userService_js_1.default.generatePaymentHash({
                txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6
            });
            res.send({ hash });
        }
        catch (error) {
            next(error);
        }
    }),
    register: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const otp = (0, otpGenerator_js_1.otpGenerator)();
            yield userService_js_1.default.registerUser({
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
            yield (0, sendEmail_js_1.sendEmail)(req.body.email, otp);
            res.status(httpStatus_js_1.HttpStatus.OK).json("OTP sent to email and saved in the database.");
        }
        catch (error) {
            next(error);
        }
    }),
    addTransaction: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { PayUOrderId, email, status } = req.body;
            console.log({ PayUOrderId, email, status });
            const transactionId = yield userService_js_1.default.addTransactionDetails(email, PayUOrderId, status);
            res.status(httpStatus_js_1.HttpStatus.OK).send(transactionId);
        }
        catch (error) {
            next(error);
        }
    }),
    saveData: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { txnid, email, productinfo, status, amount, udf1, udf2, udf3, udf4, udf5, } = req.body;
            const userId = udf1;
            const auditoriumId = udf2;
            const dishesId = udf3;
            const date = udf4;
            const category = udf5;
            const vendorId = productinfo;
            if (status === "success") {
                const bookedTripId = yield userService_js_1.default.fetchbookingData({
                    txnid,
                    email,
                    vendorId,
                    status,
                    amount,
                    userId,
                    auditoriumId,
                    dishesId,
                    date,
                    category
                });
                console.log('Booking Data:', { txnid, email, vendorId, status, amount, userId, auditoriumId, dishesId, date, category });
                if (bookedTripId) {
                    res.status(httpStatus_js_1.HttpStatus.OK).json({ success: true, bookedTripId: bookedTripId._id });
                }
                else {
                    res.status(httpStatus_js_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Booking update failed" });
                }
            }
            else {
                res.status(httpStatus_js_1.HttpStatus.BAD_REQUEST).json({ success: false, message: "Booking failed" });
            }
        }
        catch (error) {
            next(error);
        }
    }),
    fetchBookingDetails: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const booking = yield userService_js_1.default.findBookingDetails(userId);
            res.status(httpStatus_js_1.HttpStatus.OK).json(booking);
        }
        catch (error) {
            next(error);
        }
    }),
    changePassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { newPassword } = req.body;
        try {
            const updatedPassword = yield userService_js_1.default.findchangePassword(id, newPassword);
            res.status(httpStatus_js_1.HttpStatus.OK).json(updatedPassword);
        }
        catch (error) {
            next(error);
        }
    }),
};
// export const register = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const otp = generateOtp();
//     await registerUser({
//       username: req.body.username,
//       phone: req.body.phone,
//       email: req.body.email,
//       password: req.body.password,
//       otp,
//       _id: undefined,
//       address: "",
//       state: "",
//       pincode: 0,
//       reviews: undefined,
//       district: undefined
//     });
//     await generatesendEmail(req.body.email, otp);
//     res.status(200).json("OTP sent to email and saved in the database.");
//   } catch (error) {
//     next(error);
//   }
// };
// export const login = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email, password } = req.body;
//     const { user, token } = await loginUser(email, password);
//     res.cookie("token", token, {
//       sameSite: 'strict',
//       maxAge: 3600000,
//     });
//     res.status(HttpStatus.OK).json({ user, token });
//   } catch (error: any) {
//     next(error.message);
//   }
// };
// export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email, otp } = req.body;
//     const result = await verifyOtpService(email, otp);
//     res.status(HttpStatus.OK).json(result);
//   } catch (error: any) {
//     res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
//   }
// };
// export const vendorList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const vendors = await getAllVendors();
//     res.status(HttpStatus.OK).json(vendors);
//   } catch (error) {
//     next(error);
//   }
// };
// export const dishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { vendorId } = req.query;
//     const dishes = await getAllDishes(vendorId as string);
//     res.status(HttpStatus.OK).json(dishes);
//   } catch (error) {
//     next(error);
//   }
// };
// export const auditoriumlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { vendorId } = req.query;
//     const auditorium = await getAllAuditorium(vendorId as string);
//     res.status(HttpStatus.OK).json(auditorium);
//   } catch (error) {
//     next(error);
//   }
// };
// export const forgottenPassword = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email } = req.body;
//     const { user, otp } = await checkEmail(email);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.status(200).json({ message: 'OTP sent successfully', otp, email });
//   } catch (error: any) {
//     next(error.message);
//   }
// };
// export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { email, password } = req.body;
//     const user = await update(email, password);
//     res.status(HttpStatus.OK).json({ message: "Password updated successfully", user });
//   } catch (error) {
//     next(error);
//   }
// };
// export const editUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const userDetails = req.body;
//     console.log('Request Body:', userDetails);
//     const updatedUser = await editUser(userDetails);
//     res.status(HttpStatus.OK).json(updatedUser);
//   } catch (error) {
//     next(error);
//   }
// };
// export const fetchVendorDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { vendorId, userId } = req.query;
//     const result = await findVendorById(vendorId as string, userId as string);
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };
// export const fetchFoodDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { vendorId } = req.params;
//     const dishes = await findFoodVendorById(vendorId);
//     res.status(200).json(dishes);
//   } catch (error) {
//     console.error('Error in fetchFoodDetails:', error);
//     next(error);
//   }
// };
// export const fetchAuditoriumDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     console.log('Controller invoked');
//     const { vendorId } = req.params;
//     const dishes = await findAuditoriumVendorById(vendorId);
//     res.status(200).json(dishes);
//   } catch (error) {
//     console.error('Error in fetchFoodDetails:', error);
//     next(error);
//   }
// };
// export const fetchauditorium = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { auditoriumId } = req.params;
//     const vendor = await findAuditoriumById(auditoriumId);
//     res.status(200).json(vendor);
//   } catch (error) {
//     next(error);
//   }
// };
// export const fetchdishes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { dishesId } = req.params;
//     const vendor = await finddishesById(dishesId);
//     res.status(200).json(vendor);
//   } catch (error) {
//     next(error);
//   }
// };
// export const fetchBookedData = async (req: Request, res: Response, next: NextFunction) => {
//   const { id } = req.params;
//   try {
//     const booking: any = await findEvent(id);
//     res.status(200).json(booking);
//   } catch (error) {
//     next(error);
//   }
// };
// export const payment = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6 } = req.body;
//     if (!txnid || !amount || !productinfo || !username || !email || !udf1 || !udf2 || !udf3 || !udf4 || !udf5 || !udf6) {
//       return res.status(400).send("Mandatory fields missing");
//     }
//     const hash = await generatePaymentHash({
//       txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6
//     });
//     res.send({ hash });
//   } catch (error) {
//     next(error);
//   }
// };
// export const addTransaction = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { PayUOrderId, email, status } = req.body;
//     console.log({ PayUOrderId, email, status });
//     const transactionId = await addTransactionDetails(
//       email,
//       PayUOrderId,
//       status
//     );
//     res.status(200).send(transactionId);
//   } catch (error) {
//     next(error);
//   }
// };
// export const saveData = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { txnid, email, productinfo, status, amount, udf1, udf2, udf3, udf4, udf5, udf6 } = req.body;
//     const eventType = udf6;
//     const userId = udf1;
//     const auditoriumId = udf2;
//     const dishesId = udf3;
//     const date = udf4;
//     const category = udf5;
//     const vendorId = productinfo
//     console.log('Received udf6 (eventType):', udf6);
//     if (status === "success") {
//       const bookedTripId = await fetchbookingData({
//         txnid,
//         email,
//         vendorId,
//         status,
//         amount,
//         userId,
//         auditoriumId,
//         dishesId,
//         date,
//         eventType,
//         category
//       });
//       console.log('Booking Data:', { txnid, email, vendorId, status, amount, userId, auditoriumId, dishesId, date, eventType, category });
//       if (bookedTripId) {
//         res.status(200).json({ success: true, bookedTripId: bookedTripId._id });
//       } else {
//         res.status(500).json({ success: false, message: "Booking update failed" });
//       }
//     } else {
//       res.status(400).json({ success: false, message: "Booking failed" });
//     }
//   } catch (error) {
//     next(error);
//   }
// };
// export const fetchBookingDetails = async (req: Request, res: Response, next: NextFunction) => {
//   const { userId } = req.params;
//   try {
//     const booking = await findBookingDetails(userId);
//     res.status(200).json(booking);
//   } catch (error) {
//     next(error);
//   }
// };
// export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
//   const { id } = req.params;
//   const { newPassword } = req.body;
//   console.log('chage password');
//   try {
//     const updatedPassword = await findchangePassword(id, newPassword);
//     if (!updatedPassword) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(updatedPassword);
//   } catch (error) {
//     next(error);
//   }
// };
