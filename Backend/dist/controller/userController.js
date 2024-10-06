import userService from "../Service/userService.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { HttpStatus } from '../utils/httpStatus.js';
export default {
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const { user, token } = await userService.loginUser(email, password);
            res.cookie("token", token, {
                sameSite: 'strict',
                maxAge: 3600000,
            });
            res.status(HttpStatus.OK).json({ user, token });
        }
        catch (error) {
            next(error.message);
        }
    },
    verifyOtp: async (req, res, next) => {
        try {
            const { email, otp } = req.body;
            const result = await userService.verifyOtpService(email, otp);
            res.status(HttpStatus.OK).json(result);
        }
        catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    },
    vendorList: async (req, res, next) => {
        try {
            const vendors = await userService.getAllVendors();
            res.status(HttpStatus.OK).json(vendors);
        }
        catch (error) {
            next(error);
        }
    },
    dishlist: async (req, res, next) => {
        try {
            const { vendorId } = req.query;
            const dishes = await userService.getAllDishes(vendorId);
            res.status(HttpStatus.OK).json(dishes);
        }
        catch (error) {
            next(error);
        }
    },
    auditoriumlist: async (req, res, next) => {
        try {
            const { vendorId } = req.query;
            const auditorium = await userService.getAllAuditorium(vendorId);
            res.status(HttpStatus.OK).json(auditorium);
        }
        catch (error) {
            next(error);
        }
    },
    forgottenPassword: async (req, res, next) => {
        try {
            const { email } = req.body;
            const { user, otp } = await userService.checkEmail(email);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ message: 'OTP sent successfully', otp, email });
        }
        catch (error) {
            next(error.message);
        }
    },
    updatePassword: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await userService.update(email, password);
            res.status(HttpStatus.OK).json({ message: "Password updated successfully", user });
        }
        catch (error) {
            next(error);
        }
    },
    editUserDetails: async (req, res, next) => {
        try {
            const userDetails = req.body;
            console.log('Request Body:', userDetails);
            const updatedUser = await userService.editUser(userDetails);
            res.status(HttpStatus.OK).json(updatedUser);
        }
        catch (error) {
            next(error);
        }
    },
    fetchVendorDetails: async (req, res, next) => {
        try {
            const { vendorId, userId } = req.query;
            const result = await userService.findVendorById(vendorId, userId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    fetchFoodDetails: async (req, res, next) => {
        try {
            const { vendorId } = req.params;
            const dishes = await userService.findFoodVendorById(vendorId);
            res.status(200).json(dishes);
        }
        catch (error) {
            console.error('Error in fetchFoodDetails:', error);
            next(error);
        }
    },
    fetchAuditoriumDetails: async (req, res, next) => {
        try {
            console.log('Controller invoked');
            const { vendorId } = req.params;
            const dishes = await userService.findAuditoriumVendorById(vendorId);
            res.status(200).json(dishes);
        }
        catch (error) {
            console.error('Error in fetchFoodDetails:', error);
            next(error);
        }
    },
    fetchauditorium: async (req, res, next) => {
        try {
            const { auditoriumId } = req.params;
            const vendor = await userService.findAuditoriumById(auditoriumId);
            res.status(200).json(vendor);
        }
        catch (error) {
            next(error);
        }
    },
    fetchdishes: async (req, res, next) => {
        try {
            const { dishesId } = req.params;
            const vendor = await userService.finddishesById(dishesId);
            res.status(200).json(vendor);
        }
        catch (error) {
            next(error);
        }
    },
    fetchBookedData: async (req, res, next) => {
        const { id } = req.params;
        try {
            const booking = await userService.findEvent(id);
            res.status(200).json(booking);
        }
        catch (error) {
            next(error);
        }
    },
    payment: async (req, res, next) => {
        try {
            const { txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6 } = req.body;
            if (!txnid || !amount || !productinfo || !username || !email || !udf1 || !udf2 || !udf3 || !udf4 || !udf5 || !udf6) {
                return res.status(400).send("Mandatory fields missing");
            }
            const hash = await userService.generatePaymentHash({
                txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6
            });
            res.send({ hash });
        }
        catch (error) {
            next(error);
        }
    },
    register: async (req, res, next) => {
        try {
            const otp = otpGenerator();
            await userService.registerUser({
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
            await sendEmail(req.body.email, otp);
            res.status(200).json("OTP sent to email and saved in the database.");
        }
        catch (error) {
            next(error);
        }
    },
    addTransaction: async (req, res, next) => {
        try {
            const { PayUOrderId, email, status } = req.body;
            console.log({ PayUOrderId, email, status });
            const transactionId = await userService.addTransactionDetails(email, PayUOrderId, status);
            res.status(200).send(transactionId);
        }
        catch (error) {
            next(error);
        }
    },
    saveData: async (req, res, next) => {
        try {
            const { txnid, email, productinfo, status, amount, udf1, udf2, udf3, udf4, udf5, } = req.body;
            const userId = udf1;
            const auditoriumId = udf2;
            const dishesId = udf3;
            const date = udf4;
            const category = udf5;
            const vendorId = productinfo;
            if (status === "success") {
                const bookedTripId = await userService.fetchbookingData({
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
    },
    fetchBookingDetails: async (req, res, next) => {
        const { userId } = req.params;
        try {
            const booking = await userService.findBookingDetails(userId);
            res.status(200).json(booking);
        }
        catch (error) {
            next(error);
        }
    },
    changePassword: async (req, res, next) => {
        const { id } = req.params;
        const { newPassword } = req.body;
        try {
            const updatedPassword = await userService.findchangePassword(id, newPassword);
            res.status(200).json(updatedPassword);
        }
        catch (error) {
            next(error);
        }
    },
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
