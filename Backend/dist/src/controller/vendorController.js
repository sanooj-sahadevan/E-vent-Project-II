import userService from "../Service/vendorService.js";
import { HttpStatus } from "../utils/httpStatus.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
export default {
    register: async (req, res, next) => {
        try {
            const { vendorname, email, phone, password } = req.body;
            const proceedWithRegistration = async () => {
                try {
                    const otp = otpGenerator();
                    await userService.registerVendor({
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
                    next(error);
                }
            };
            await proceedWithRegistration();
        }
        catch (error) {
            next(error);
        }
    },
    verifyOtp: async (req, res, next) => {
        try {
            const { email, otp } = req.body;
            console.log(email, otp);
            const vendor = await userService.findVendorByEmailService(email);
            console.log(vendor);
            if (!vendor) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor not found" });
                return;
            }
            if (vendor.otp === otp) {
                await userService.verifyAndSaveVendor(email, otp);
                res.status(HttpStatus.OK).json("Vendor registered successfully");
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
            }
        }
        catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const { vendor, vendorToken } = await userService.loginVendor(email, password);
            res.cookie("vendorToken", vendorToken);
            res.status(HttpStatus.OK).json({ vendor, vendorToken });
        }
        catch (error) {
            next(error);
        }
    },
    fetchAddress: async (req, res, next) => {
        try {
            console.log("vann ta");
            const vendorAddresses = await userService.vendorAddress();
            console.log(vendorAddresses);
            res.status(HttpStatus.OK).json(vendorAddresses);
        }
        catch (error) {
            next(error);
        }
    },
    editVendorDetails: async (req, res, next) => {
        try {
            const vendorDetails = req.body;
            const file = req.file;
            let imageUrl;
            if (file) {
                imageUrl = await userService.uploadImage(file);
            }
            const updatedVendor = await userService.editVendorService(vendorDetails, imageUrl);
            res.status(HttpStatus.OK).json({ ...updatedVendor, imageUrl });
        }
        catch (error) {
            next(error);
        }
    },
    fetchVendorDetails: async (req, res, next) => {
        try {
            console.log('controller');
            const { vendorId } = req.params; // Extract vendorId from request params
            const vendor = await userService.findVendorById(vendorId); // Fetch vendor details
            if (!vendor) {
                res.status(HttpStatus.NOT_FOUND).json({ message: "Vendor not found" });
            }
            else {
                res.status(HttpStatus.OK).json(vendor);
            }
        }
        catch (error) {
            next(error);
        }
    },
    fetchdishes: async (req, res, next) => {
        try {
            const { dishesId } = req.params;
            const vendor = await userService.findDishesById(dishesId);
            res.status(HttpStatus.OK).json(vendor);
        }
        catch (error) {
            next(error);
        }
    },
    fetchauditorium: async (req, res, next) => {
        try {
            const { auditoriumId } = req.params;
            const vendor = await userService.findAuditoriumById(auditoriumId);
            res.status(HttpStatus.OK).json(vendor);
        }
        catch (error) {
            next(error);
        }
    },
    addDishes: async (req, res, next) => {
        try {
            const { body } = req;
            const vendorId = req.vendorId;
            console.log(vendorId, 'vendorId-----------------------------------------------------');
            if (!vendorId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor ID is required" });
            }
            const file = req.file;
            let imageUrl = undefined;
            if (file) {
                imageUrl = await userService.uploadImage(file);
            }
            await userService.uploadDishes(vendorId, body, imageUrl);
            return res.status(HttpStatus.OK).json("Dishes added successfully");
        }
        catch (error) {
            console.error("Error adding dishes: ", error);
            next(error);
        }
    },
    addAuditorium: async (req, res, next) => {
        try {
            const { body } = req;
            const vendorId = req.vendorId;
            if (!vendorId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor ID is required" });
            }
            const file = req.file;
            let imageUrl = undefined;
            if (file) {
                imageUrl = await userService.uploadImage(file);
            }
            const auditoriumData = await userService.uploadAuditorium(vendorId, body, imageUrl);
            if (auditoriumData) {
                return res.status(HttpStatus.OK).json("Auditorium added successfully");
            }
            else {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "Auditorium not added: something went wrong" });
            }
        }
        catch (error) {
            console.error("Error adding auditorium: ", error);
            next(error);
        }
    },
    fetchDetailsVendor: async (req, res, next) => {
        try {
            const { vendorId } = req.params;
            const vendor = await userService.findVendorById(vendorId);
            res.status(HttpStatus.OK).json(vendor);
        }
        catch (error) {
            console.error('Error in fetchDetailsVendor:', error);
            next(error);
        }
    },
    fetchFoodDetails: async (req, res, next) => {
        try {
            const { vendorId } = req.params;
            const dishes = await userService.findFoodVendorById(vendorId);
            if (!dishes || dishes.length === 0) {
                res.status(HttpStatus.NOT_FOUND).json({ message: "No dishes found for this vendor" });
            }
            else {
                console.log(dishes, 'Fetched dishes for vendor');
                res.status(HttpStatus.OK).json(dishes);
            }
        }
        catch (error) {
            console.error('Error in fetchFoodDetails:', error);
            next(error);
        }
    },
    fetchAuditoriumDetails: async (req, res, next) => {
        try {
            const { vendorId } = req.params;
            const auditorium = await userService.findAuditoriumVendorById(vendorId);
            if (!auditorium || auditorium.length === 0) {
                res.status(HttpStatus.NOT_FOUND).json({ message: "No dishes found for this vendor" });
            }
            else {
                console.log(auditorium, 'Fetched dishes for vendor');
                res.status(HttpStatus.OK).json(auditorium);
            }
        }
        catch (error) {
            console.error('Error in fetchFoodDetails:', error);
            next(error);
        }
    },
    softDeleteDish: async (req, res, next) => {
        try {
            const { dishId } = req.params;
            if (!dishId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Dish ID is missing' });
            }
            const updatedDish = await userService.softDeleteDishService(dishId);
            res.status(HttpStatus.OK).json({ message: 'Dish deleted successfully', dish: updatedDish });
        }
        catch (error) {
            next(error);
        }
    },
    softDeleteAuditorium: async (req, res, next) => {
        try {
            const { auditoriumId } = req.params;
            if (!auditoriumId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Auditorium ID is missing' });
            }
            const updatedAuditorium = await userService.softDeleteAuditoriumService(auditoriumId);
            res.status(HttpStatus.OK).json({ message: 'Auditorium deleted successfully', auditorium: updatedAuditorium });
        }
        catch (error) {
            next(error);
        }
    },
    vendorBookingDetils: async (req, res, next) => {
        const { vendorId } = req.params;
        try {
            const booking = await userService.findBookingDetails(vendorId);
            res.status(HttpStatus.OK).json(booking);
        }
        catch (error) {
            next(error);
        }
    },
    getUnreadMessagesCount: async (req, res, next) => {
        const vendorId = req.vendorId;
        try {
            if (!vendorId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor ID is required" });
            }
            const chatServiceData = await userService.chatServices({ vendorId });
            const chatIds = chatServiceData.map((chat) => chat._id);
            if (chatIds.length === 0) {
                return res.status(HttpStatus.OK).json({ unreadCount: 0 });
            }
            const unreadCount = await userService.messageService({ chatIds, vendorId });
            res.status(HttpStatus.OK).json({ unreadCount });
        }
        catch (error) {
            next(error);
        }
    },
};
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
