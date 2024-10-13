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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const otpGenerator_1 = require("../utils/otpGenerator");
const sendEmail_1 = require("../utils/sendEmail");
const httpStatus_1 = require("../utils/httpStatus");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { user, token } = yield this.userService.loginUser(email, password);
                res.cookie("token", token, {
                    sameSite: 'strict',
                    maxAge: 3600000,
                });
                res.status(httpStatus_1.HttpStatus.OK).json({ user, token });
            }
            catch (error) {
                next(error.message);
            }
        });
    }
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                console.log({ otp });
                const result = yield this.userService.verifyOtpService(email, otp);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
        });
    }
    vendorList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendors = yield this.userService.getAllVendors();
                res.status(httpStatus_1.HttpStatus.OK).json(vendors);
            }
            catch (error) {
                next(error);
            }
        });
    }
    dishlist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.query;
                const dishes = yield this.userService.getAllDishes(vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(dishes);
            }
            catch (error) {
                next(error);
            }
        });
    }
    auditoriumlist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.query;
                const auditorium = yield this.userService.getAllAuditorium(vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(auditorium);
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgottenPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const { user, otp } = yield this.userService.checkEmail(email);
                if (!user) {
                    return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ error: 'User not found' });
                }
                res.status(httpStatus_1.HttpStatus.OK).json({ message: 'OTP sent successfully', otp, email });
            }
            catch (error) {
                next(error.message);
            }
        });
    }
    updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.userService.update(email, password);
                res.status(httpStatus_1.HttpStatus.OK).json({ message: "Password updated successfully", user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    editUserDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = req.body;
                console.log('Request Body:', userDetails);
                const updatedUser = yield this.userService.editUser(userDetails);
                res.status(httpStatus_1.HttpStatus.OK).json(updatedUser);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchVendorDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId, userId } = req.query;
                const result = yield this.userService.findVendorById(vendorId, userId);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('kokokokokokkokokokokokokokokokok');
            try {
                const { vendorId, userId } = req.query;
                const result = yield this.userService.fetchReviewById(vendorId, userId);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchFoodDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.params;
                const dishes = yield this.userService.findFoodVendorById(vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(dishes);
            }
            catch (error) {
                console.error('Error in fetchFoodDetails:', error);
                next(error);
            }
        });
    }
    fetchAuditoriumDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.params;
                const dishes = yield this.userService.findAuditoriumVendorById(vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(dishes);
            }
            catch (error) {
                console.error('Error in fetchFoodDetails:', error);
                next(error);
            }
        });
    }
    fetchauditorium(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { auditoriumId } = req.params;
                const vendor = yield this.userService.findAuditoriumById(auditoriumId);
                res.status(httpStatus_1.HttpStatus.OK).json(vendor);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchdishes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dishesId } = req.params;
                const vendor = yield this.userService.finddishesById(dishesId);
                res.status(httpStatus_1.HttpStatus.OK).json(vendor);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchBookedData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const booking = yield this.userService.findEvent(id);
                res.status(httpStatus_1.HttpStatus.OK).json(booking);
            }
            catch (error) {
                next(error);
            }
        });
    }
    payment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6 } = req.body;
                if (!txnid || !amount || !productinfo || !username || !email || !udf1 || !udf2 || !udf3 || !udf4 || !udf5 || !udf6) {
                    return res.status(400).send("Mandatory fields missing");
                }
                const hash = yield this.userService.generatePaymentHash({
                    txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6
                });
                res.send({ hash });
            }
            catch (error) {
                next(error);
            }
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = (0, otpGenerator_1.otpGenerator)();
                yield this.userService.registerUser({
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
                yield (0, sendEmail_1.sendEmail)(req.body.email, otp);
                res.status(httpStatus_1.HttpStatus.OK).json("OTP sent to email and saved in the database.");
            }
            catch (error) {
                next(error);
            }
        });
    }
    addTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { PayUOrderId, email, status } = req.body;
                const transactionId = yield this.userService.addTransactionDetails(email, PayUOrderId, status);
                res.status(httpStatus_1.HttpStatus.OK).send(transactionId);
            }
            catch (error) {
                next(error);
            }
        });
    }
    saveData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { txnid, email, productinfo, status, amount, udf1, udf2, udf3, udf4, udf5, } = req.body;
                const userId = udf1;
                const auditoriumId = udf2;
                const dishesId = udf3;
                const date = udf4;
                const category = udf5;
                const vendorId = productinfo;
                console.log(date);
                if (status === "success") {
                    const bookedTripId = yield this.userService.fetchbookingData({
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
                        res.status(httpStatus_1.HttpStatus.OK).json({ success: true, bookedTripId: bookedTripId._id });
                    }
                    else {
                        res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Booking update failed" });
                    }
                }
                else {
                    res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ success: false, message: "Booking failed" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchBookingDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const booking = yield this.userService.findBookingDetails(userId);
                res.status(httpStatus_1.HttpStatus.OK).json(booking);
            }
            catch (error) {
                next(error);
            }
        });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { newPassword } = req.body;
            try {
                const updatedPassword = yield this.userService.findchangePassword(id, newPassword);
                res.status(httpStatus_1.HttpStatus.OK).json(updatedPassword);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUnreadMessagesCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.query.userId;
            console.log('User ID from query:', userId);
            try {
                if (!userId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "User ID is required" });
                }
                console.log('Controller hit with valid userId');
                const chatServiceData = yield this.userService.chatServices({ userId });
                const chatIds = chatServiceData.map((chat) => chat._id);
                if (chatIds.length === 0) {
                    return res.status(httpStatus_1.HttpStatus.OK).json({ unreadCount: 0 });
                }
                const unreadCount = yield this.userService.messageService({ chatIds, userId });
                console.log('Unread messages count:', unreadCount);
                res.status(httpStatus_1.HttpStatus.OK).json({ unreadCount });
            }
            catch (error) {
                next(error);
            }
        });
    }
    review(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviews, stars, userId, vendorId } = req.body;
                if (!reviews || !stars || !userId || !vendorId) {
                    return res.status(400).json({ message: 'All fields are required' });
                }
                const reviewData = yield this.userService.reviewService({ reviews, stars, userId, vendorId });
                res.status(httpStatus_1.HttpStatus.OK).json(reviewData);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
/*


export default {

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await userService.loginUser(email, password);
      res.cookie("token", token, {
        sameSite: 'strict',
        maxAge: 3600000,
      });

      res.status(HttpStatus.OK).json({ user, token });
    } catch (error: any) {
      next(error.message);
    }
  },

  verifyOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      const result = await userService.verifyOtpService(email, otp);
      res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  },




  vendorList: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const vendors = await userService.getAllVendors();
      res.status(HttpStatus.OK).json(vendors);
    } catch (error) {
      next(error);
    }
  },

  dishlist: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { vendorId } = req.query;
      const dishes = await userService.getAllDishes(vendorId as string);
      res.status(HttpStatus.OK).json(dishes);

    } catch (error) {
      next(error);
    }
  },

  auditoriumlist: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { vendorId } = req.query;
      const auditorium = await userService.getAllAuditorium(vendorId as string);
      res.status(HttpStatus.OK).json(auditorium);
    } catch (error) {
      next(error);
    }
  },


  forgottenPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const { user, otp } = await userService.checkEmail(email);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found' });
      }
      res.status(HttpStatus.OK).json({ message: 'OTP sent successfully', otp, email });
    } catch (error: any) {
      next(error.message);
    }
  },



  updatePassword: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await userService.update(email, password);

      res.status(HttpStatus.OK).json({ message: "Password updated successfully", user });
    } catch (error) {
      next(error);
    }
  },



  editUserDetails: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userDetails = req.body;
      console.log('Request Body:', userDetails);
      const updatedUser = await userService.editUser(userDetails);
      res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },



  fetchVendorDetails: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { vendorId, userId } = req.query;
      const result = await userService.findVendorById(vendorId as string, userId as string);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  },


  fetchFoodDetails: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { vendorId } = req.params;
      const dishes = await userService.findFoodVendorById(vendorId);

      res.status(HttpStatus.OK).json(dishes);

    } catch (error) {
      console.error('Error in fetchFoodDetails:', error);
      next(error);
    }
  },


  fetchAuditoriumDetails: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Controller invoked');

      const { vendorId } = req.params;
      const dishes = await userService.findAuditoriumVendorById(vendorId);

      res.status(HttpStatus.OK).json(dishes);
    } catch (error) {
      console.error('Error in fetchFoodDetails:', error);
      next(error);
    }
  },

  fetchauditorium: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { auditoriumId } = req.params;
      const vendor = await userService.findAuditoriumById(auditoriumId);
      res.status(HttpStatus.OK).json(vendor);
    } catch (error) {
      next(error);
    }
  },

  fetchdishes: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dishesId } = req.params;
      const vendor = await userService.finddishesById(dishesId);
      res.status(HttpStatus.OK).json(vendor);
    } catch (error) {
      next(error);
    }
  },


  fetchBookedData: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {

      const booking: any = await userService.findEvent(id);
      res.status(HttpStatus.OK).json(booking);
    } catch (error) {
      next(error);
    }
  },

  payment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6 } = req.body;
      if (!txnid || !amount || !productinfo || !username || !email || !udf1 || !udf2 || !udf3 || !udf4 || !udf5 || !udf6) {
        return res.status(400).send("Mandatory fields missing");
      }
      const hash = await userService.generatePaymentHash({
        txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6
      });
      res.send({ hash });
    } catch (error) {
      next(error);
    }
  },
  register: async (req: Request, res: Response, next: NextFunction) => {
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
      res.status(HttpStatus.OK).json("OTP sent to email and saved in the database.");
    } catch (error) {
      next(error);
    }
  },


  addTransaction: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { PayUOrderId, email, status } = req.body;
      console.log({ PayUOrderId, email, status });

      const transactionId = await userService.addTransactionDetails(
        email,
        PayUOrderId,
        status
      );

      res.status(HttpStatus.OK).send(transactionId);
    } catch (error) {
      next(error);
    }
  },


  saveData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { txnid, email, productinfo, status, amount, udf1, udf2, udf3, udf4, udf5,  } = req.body;

      const userId = udf1;
      const auditoriumId = udf2;
      const dishesId = udf3;
      const date = udf4;
      const category = udf5;
      const vendorId = productinfo

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
          res.status(HttpStatus.OK).json({ success: true, bookedTripId: bookedTripId._id });
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Booking update failed" });
        }
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Booking failed" });
      }
    } catch (error) {
      next(error);
    }
  },



  fetchBookingDetails: async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try {
      const booking = await userService.findBookingDetails(userId);
      res.status(HttpStatus.OK).json(booking);
    } catch (error) {
      next(error);

    }
  },

  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    try {
      const updatedPassword = await userService.findchangePassword(id, newPassword);
      res.status(HttpStatus.OK).json(updatedPassword);
    } catch (error) {
      next(error);

    }
  },
}

*/
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
