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
exports.VendorController = void 0;
// import userService from "../Service/vendorService"
const httpStatus_1 = require("../utils/httpStatus");
const otpGenerator_1 = require("../utils/otpGenerator");
const sendEmail_1 = require("../utils/sendEmail");
class VendorController {
    constructor(vendorService) {
        this.vendorService = vendorService;
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorname, email, phone, password } = req.body;
                const proceedWithRegistration = () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const otp = (0, otpGenerator_1.otpGenerator)();
                        yield this.vendorService.registerVendor({
                            vendorname,
                            phone,
                            email,
                            password,
                            otp,
                            reviews: "",
                            address: "",
                            district: "",
                            state: "",
                            description: "",
                            reviewsID: null,
                        });
                        yield (0, sendEmail_1.sendEmail)(email, otp);
                        res.status(httpStatus_1.HttpStatus.OK).json("OTP sent to email");
                    }
                    catch (error) {
                        next(error);
                    }
                });
                yield proceedWithRegistration();
            }
            catch (error) {
                next(error);
            }
        });
    }
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const vendor = yield this.vendorService.findVendorByEmailService(email);
                if (!vendor) {
                    res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Vendor not found" });
                    return;
                }
                if (vendor.otp === otp) {
                    yield this.vendorService.verifyAndSaveVendor(email, otp);
                    res.status(httpStatus_1.HttpStatus.OK).json("Vendor registered successfully");
                }
                else {
                    res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { vendor, vendorToken } = yield this.vendorService.loginVendor(email, password);
                res.cookie("vendorToken", vendorToken);
                res.status(httpStatus_1.HttpStatus.OK).json({ vendor, vendorToken });
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchAddress(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorAddresses = yield this.vendorService.vendorAddress();
                res.status(httpStatus_1.HttpStatus.OK).json(vendorAddresses);
            }
            catch (error) {
                next(error);
            }
        });
    }
    editVendorDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = req.body;
                const updatedUser = yield this.vendorService.editVendorService(userDetails);
                res.status(httpStatus_1.HttpStatus.OK).json(updatedUser);
            }
            catch (error) {
                console.error('Error in editUserDetails controller:', error);
                next(error);
            }
        });
    }
    fetchVendorDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.params; // Extract vendorId from request params
                const vendor = yield this.vendorService.findVendorById(vendorId); // Fetch vendor details
                if (!vendor) {
                    res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ message: "Vendor not found" });
                }
                else {
                    res.status(httpStatus_1.HttpStatus.OK).json(vendor);
                }
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
                const vendor = yield this.vendorService.findDishesById(dishesId);
                res.status(httpStatus_1.HttpStatus.OK).json(vendor);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchauditorium(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { auditoriumId } = req.params;
                const vendor = yield this.vendorService.findAuditoriumById(auditoriumId);
                res.status(httpStatus_1.HttpStatus.OK).json(vendor);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPresignedUrl(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fileName, fileType } = req.query;
                if (!fileName || !fileType) {
                    return res.status(400).json({ error: "fileName and fileType are required" });
                }
                const presignedUrl = yield this.vendorService.uploadImage(fileName, fileType);
                return res.status(200).json({ url: presignedUrl });
            }
            catch (error) {
                console.error("Error generating pre-signed URL:", error);
                next(error);
            }
        });
    }
    addDishes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const vendorId = req.vendorId;
                if (!vendorId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Vendor ID is required" });
                }
                yield this.vendorService.uploadDishes(vendorId, body, body.image);
                return res.status(httpStatus_1.HttpStatus.OK).json("Dishes added successfully");
            }
            catch (error) {
                console.error("Error adding dishes: ", error);
                next(error);
            }
        });
    }
    addAuditorium(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const vendorId = req.vendorId;
                if (!vendorId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Vendor ID is required" });
                }
                const auditoriumData = yield this.vendorService.uploadAuditorium(vendorId, body, body.image);
                if (auditoriumData) {
                    return res.status(httpStatus_1.HttpStatus.OK).json("Auditorium added successfully");
                }
                else {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Auditorium not added: something went wrong" });
                }
            }
            catch (error) {
                console.error("Error adding auditorium: ", error);
                next(error);
            }
        });
    }
    fetchDetailsVendor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.params;
                const vendor = yield this.vendorService.findVendorById(vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(vendor);
            }
            catch (error) {
                console.error('Error in fetchDetailsVendor:', error);
                next(error);
            }
        });
    }
    fetchFoodDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.params;
                const dishes = yield this.vendorService.findFoodVendorById(vendorId);
                if (!dishes || dishes.length === 0) {
                    res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ message: "No dishes found for this vendor" });
                }
                else {
                    console.log(dishes, 'Fetched dishes for vendor');
                    res.status(httpStatus_1.HttpStatus.OK).json(dishes);
                }
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
                const auditorium = yield this.vendorService.findAuditoriumVendorById(vendorId);
                if (!auditorium || auditorium.length === 0) {
                    res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ message: "No dishes found for this vendor" });
                }
                else {
                    console.log(auditorium, 'Fetched dishes for vendor');
                    res.status(httpStatus_1.HttpStatus.OK).json(auditorium);
                }
            }
            catch (error) {
                console.error('Error in fetchFoodDetails:', error);
                next(error);
            }
        });
    }
    softDeleteDish(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dishId } = req.params;
                if (!dishId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ message: 'Dish ID is missing' });
                }
                const updatedDish = yield this.vendorService.softDeleteDishService(dishId);
                res.status(httpStatus_1.HttpStatus.OK).json({ message: 'Dish deleted successfully', dish: updatedDish });
            }
            catch (error) {
                next(error);
            }
        });
    }
    softDeleteAuditorium(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { auditoriumId } = req.params;
                if (!auditoriumId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ message: 'Auditorium ID is missing' });
                }
                const updatedAuditorium = yield this.vendorService.softDeleteAuditoriumService(auditoriumId);
                res.status(httpStatus_1.HttpStatus.OK).json({ message: 'Auditorium deleted successfully', auditorium: updatedAuditorium });
            }
            catch (error) {
                next(error);
            }
        });
    }
    vendorBookingDetils(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { vendorId } = req.params;
            try {
                const booking = yield this.vendorService.findBookingDetails(vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(booking);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUnreadMessagesCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorId = req.vendorId;
            try {
                if (!vendorId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Vendor ID is required" });
                }
                const chatServiceData = yield this.vendorService.chatServices({ vendorId });
                const chatIds = chatServiceData.map((chat) => chat._id);
                if (chatIds.length === 0) {
                    return res.status(httpStatus_1.HttpStatus.OK).json({ unreadCount: 0 });
                }
                const unreadCount = yield this.vendorService.messageService({ chatIds, vendorId });
                res.status(httpStatus_1.HttpStatus.OK).json({ unreadCount });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.VendorController = VendorController;
// export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { vendorname, email, phone, password } = req.body;
//     const proceedWithRegistration = async () => {
//       try {
//         const otp = otpGenerator();
//         await registerVendor({
//           vendorname,
//           phone,
//           email,
//           password,
//           otp,
//           reviews: "",
//           address: "",
//           district: "",
//           state: ""
//         });
//         await sendEmail(email, otp);
//         res.status(HttpStatus.OK).json("OTP sent to email");
//       } catch (error: any) {
//         console.error('Error during registration:', error.message);
//         res.status(HttpStatus.BAD_REQUEST).json({ error: "Registration failed: " + error.message });
//       }
//     };
//     await proceedWithRegistration();
//   } catch (error: any) {
//     next(error);
//   }
// };
// export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { email, otp } = req.body;
//     console.log(email, otp);
//     const vendor = await findVendorByEmailService(email);
//     console.log(vendor);
//     if (!vendor) {
//       res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor not found" });
//       return;
//     }
//     if (vendor.otp === otp) {
//       await verifyAndSaveVendor(email, otp);
//       res.status(HttpStatus.OK).json("Vendor registered successfully");
//     } else {
//       res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
//     }
//   } catch (error: any) {
//     next(error);
//   }
// };
// export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { email, password } = req.body;
//     const { vendor, vendorToken } = await loginVendor(email, password);
//     res.cookie("vendorToken", vendorToken,);
//     res.status(HttpStatus.OK).json({ vendor, vendorToken });
//   } catch (error: any) {
//     next(error);
//   }
// };
// export const fetchAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     console.log("vann ta");
//     const vendorAddresses = await vendorAddress();
//     console.log(vendorAddresses);
//     res.status(HttpStatus.OK).json(vendorAddresses);
//   } catch (error) {
//     next(error);
//   }
// };
// export const editVendorDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const vendorDetails = req.body;
//     const file = req.file as unknown as IMulterFile;
//     let imageUrl: string | undefined;
//     if (file) {
//       imageUrl = await uploadImage(file);
//     }
//     const updatedVendor = await editVendorService(vendorDetails, imageUrl);
//     res.status(200).json({ ...updatedVendor, imageUrl }); 
//   } catch (error) {
//     next(error); 
//   }
// };
// export const fetchVendorDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     console.log('controller');
//     const { vendorId } = req.params; // Extract vendorId from request params
//     const vendor = await findVendorById(vendorId); // Fetch vendor details
//     if (!vendor) {
//       res.status(404).json({ message: "Vendor not found" });
//     } else {
//       res.status(200).json(vendor);
//     }
//   } catch (error) {
//     next(error);
//   }
// };
// export const fetchdishes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { dishesId } = req.params;
//     const vendor = await findDishesById(dishesId);
//       res.status(200).json(vendor);
//   } catch (error) {
//     next(error);
//   }
// };
// export const fetchauditorium = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { auditoriumId } = req.params;
//     const vendor = await findAuditoriumById(auditoriumId);
//       res.status(200).json(vendor);
//   } catch (error) {
//     next(error);
//   }
// };
// interface ExtendedRequest extends Request {
//   vendorId?: string;
// }
// export const addDishes = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
//   try {
//     const { body } = req;
//     const vendorId = req.vendorId;
//     if (!vendorId) {
//       return res.status(400).json({ error: "Vendor ID is required" });
//     }
//     const file = req.file as unknown as IMulterFile;
//     let imageUrl: string | undefined = undefined;
//     if (file) {
//       imageUrl = await uploadImage(file);
//     }
//     await uploadDishes(vendorId, body, imageUrl);
//     return res.status(400).json({ error: "Dishes not added: something went wrong" });
//   } catch (error) {
//     console.error("Error adding dishes: ", error);
//     next(error);
//   }
// };
// export const addAuditorium = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
//   try {
//     const { body } = req;
//     const vendorId = req.vendorId;
//     if (!vendorId) {
//       return res.status(400).json({ error: "Vendor ID is required" });
//     }
//     const file = req.file as unknown as IMulterFile;
//     let imageUrl: string | undefined = undefined;
//     if (file) {
//       imageUrl = await uploadImage(file);
//     }
//     const auditoriumData = await uploadAuditorium(vendorId, body, imageUrl);
//     if (auditoriumData) {
//       return res.status(200).json("Auditorium added successfully");
//     } else {
//       return res.status(400).json({ error: "Auditorium not added: something went wrong" });
//     }
//   } catch (error) {
//     console.error("Error adding auditorium: ", error);
//     next(error);
//   }
// };
// export const fetchDetailsVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { vendorId } = req.params;
//     const vendor = await findVendorById(vendorId);
//       res.status(200).json(vendor);
//   } catch (error) {
//     console.error('Error in fetchDetailsVendor:', error);
//     next(error);
//   }
// };
// export const fetchFoodDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { vendorId } = req.params;
//     const dishes = await findFoodVendorById(vendorId);
//     if (!dishes || dishes.length === 0) {
//       res.status(404).json({ message: "No dishes found for this vendor" });
//     } else {
//       console.log(dishes, 'Fetched dishes for vendor');
//       res.status(200).json(dishes);
//     }
//   } catch (error) {
//     console.error('Error in fetchFoodDetails:', error);
//     next(error);
//   }
// };
// export const fetchAuditoriumDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { vendorId } = req.params;
//     const auditorium = await findAuditoriumVendorById(vendorId);
//     if (!auditorium || auditorium.length === 0) {
//       res.status(404).json({ message: "No dishes found for this vendor" });
//     } else {
//       console.log(auditorium, 'Fetched dishes for vendor');
//       res.status(200).json(auditorium);
//     }
//   } catch (error) {
//     console.error('Error in fetchFoodDetails:', error);
//     next(error);
//   }
// };
// export const softDeleteDish = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { dishId } = req.params;
//     if (!dishId) {
//       return res.status(400).json({ message: 'Dish ID is missing' });
//     }
//     const updatedDish = await softDeleteDishService(dishId); 
//     res.status(200).json({ message: 'Dish deleted successfully', dish: updatedDish });
//   } catch (error) {
//     next(error);
//   }
// };
// export const softDeleteAuditorium = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { auditoriumId } = req.params;
//     if (!auditoriumId) {
//       return res.status(400).json({ message: 'Auditorium ID is missing' });
//     }
//     const updatedAuditorium = await softDeleteAuditoriumService(auditoriumId); 
//     res.status(200).json({ message: 'Auditorium deleted successfully', auditorium: updatedAuditorium });
//   } catch (error) {
//     next(error);
//   }
// };
// export const vendorBookingDetils = async (req: Request, res: Response, next: NextFunction) => {
//   const { vendorId } = req.params;
//   try {
//     const booking = await findBookingDetails(vendorId)
//     res.status(200).json(booking);
//   } catch (error) {
//     next(error);
//   }
// };
// export const getUnreadMessagesCount = async (
//   req: any,
//   res: any, next: NextFunction
// ): Promise<void> => {
//   const vendorId = req.vendorId;
//   try {
//     if (!vendorId) {
//       return res.status(400).json({ error: "Vendor ID is required" });
//     }
//     const chatServiceData = await chatServices({ vendorId });
//     const chatIds = chatServiceData.map((chat: any) => chat._id);
//     if (chatIds.length === 0) {
//       return res.status(200).json({ unreadCount: 0 });
//     }
//     const unreadCount = await messageService({ chatIds, vendorId });
//     res.status(200).json({ unreadCount });
//   } catch (error) {
//     next(error);
//   }
// };
