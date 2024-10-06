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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const vendorRepo_js_1 = __importDefault(require("../Repository/vendorRepo.js"));
const fileUpload_js_1 = require("../middleware/fileUpload.js");
const index_js_1 = require("../index.js");
exports.default = {
    registerVendor: (vendor) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const existingVendor = yield vendorRepo_js_1.default.findVendorByEmail(vendor.email);
            console.log(existingVendor);
            if (existingVendor) {
                if (existingVendor.otpVerified) {
                    throw new Error("User already exists");
                }
                else {
                    yield vendorRepo_js_1.default.updateVendor(existingVendor.email, vendor);
                    return existingVendor;
                }
            }
            return yield vendorRepo_js_1.default.createVendor(vendor);
        }
        catch (error) {
            console.error("Error during user registration:", error);
            throw error;
        }
    }),
    verifyAndSaveVendor: (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
        const vendor = yield vendorRepo_js_1.default.findVendorByEmail(email);
        if (vendor && vendor.otp === otp) {
            vendor.otp = undefined;
            vendor.otpVerified = true;
            yield vendor.save();
            return vendor;
        }
        throw new Error("Invalid OTP");
    }),
    loginVendor: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const vendor = yield vendorRepo_js_1.default.findVendorByEmail(email);
        if (!vendor) {
            throw new Error("Invalid Email/Password");
        }
        const vendorToken = jsonwebtoken_1.default.sign({ vendorId: vendor._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return { vendor, vendorToken };
    }),
    vendorAddress: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield vendorRepo_js_1.default.vendorAddressFromDB();
        }
        catch (error) {
            throw new Error('Failed to fetch vendor addresses');
        }
    }),
    editVendorService: (vendorDetails, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const existingVendor = yield vendorRepo_js_1.default.findVendorByEmailRepo(vendorDetails.email);
            if (existingVendor) {
                return yield vendorRepo_js_1.default.editVendorRepo(existingVendor, vendorDetails, imageUrl);
            }
            else {
                return yield vendorRepo_js_1.default.editVendorRepo(null, vendorDetails, imageUrl);
            }
        }
        catch (error) {
            throw new Error('Failed to update vendor details');
        }
    }),
    uploadImage: function (imageFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('first step');
                const uploadedUrl = yield (0, fileUpload_js_1.uploadToS3Bucket)([], imageFile);
                return uploadedUrl;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    },
    findVendorById: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendor = yield vendorRepo_js_1.default.findVendorByIdInDb(vendorId);
            if (!vendor) {
                throw new Error(`Error finding vendor`);
            }
            return vendor;
        }
        catch (error) {
            throw new Error(`Error finding vendor: ${error}`);
        }
    }),
    findAuditoriumById: (auditoriumId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('controller 2');
            const vendor = yield vendorRepo_js_1.default.findAuditoriumByIdInDb(auditoriumId);
            if (!vendor) {
                throw new Error(`Error finding vendor`);
            }
            return vendor;
        }
        catch (error) {
            throw new Error(`Error finding vendor: ${error}`);
        }
    }),
    findDishesById: (dishesId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendor = yield vendorRepo_js_1.default.findDishesByIdInDb(dishesId);
            if (!vendor) {
                throw new Error(`Error finding vendor`);
            }
            return vendor;
        }
        catch (error) {
            throw new Error(`Error finding vendor: ${error}`);
        }
    }),
    uploadDishes: (vendorId, data, images) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('duisg servuive');
            const dishesData = { vendorId, data, images };
            dishesData.data.price = Number(dishesData.data.price);
            const newDish = yield vendorRepo_js_1.default.createDishes(dishesData);
            console.log(newDish);
            return newDish;
        }
        catch (error) {
            console.error("Error in uploadDishes: ", error);
            console.error();
        }
    }),
    uploadAuditorium: (vendorId, data, image) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const auditoriumData = { vendorId, data, image };
            auditoriumData.data.price = Number(auditoriumData.data.price);
            const newAuditorium = yield vendorRepo_js_1.default.createAuditorium(auditoriumData);
            return newAuditorium;
        }
        catch (error) {
            console.error("Error in uploadAuditorium: ", error);
            throw error;
        }
    }),
    findFoodVendorById: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Service invoked to find dishes for vendor:', vendorId);
            const dishes = yield vendorRepo_js_1.default.findFoodVendorIdInDb(vendorId);
            return dishes;
        }
        catch (error) {
            throw new Error(`Error finding vendor dishes: ${error}`);
        }
    }),
    findAuditoriumVendorById: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Service invoked to find auditorium for vendor:', vendorId);
            const Auditorium = yield vendorRepo_js_1.default.findAuditoriumVendorIdInDb(vendorId);
            return Auditorium;
        }
        catch (error) {
            throw new Error(`Error finding vendor dishes: ${error}`);
        }
    }),
    softDeleteDishService: (dishId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedDish = yield vendorRepo_js_1.default.softDeleteDishRepo(dishId);
            if (!updatedDish) {
                throw new Error(`Error soft-deleting dish`);
            }
            return updatedDish;
        }
        catch (error) {
            throw new Error(`Error soft-deleting dish: ${error}`);
        }
    }),
    softDeleteAuditoriumService: (auditoriumId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedAuditorium = yield vendorRepo_js_1.default.softDeleteAuditoriumRepo(auditoriumId);
            if (!updatedAuditorium) {
                throw new Error(`Error soft-deleting auditorium`);
            }
            return updatedAuditorium;
        }
        catch (error) {
            throw new Error(`Error soft-deleting auditorium: ${error}`);
        }
    }),
    findBookingDetails: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bookingDetails = yield vendorRepo_js_1.default.findDetailsByvendorId(vendorId);
            if (!bookingDetails) {
                throw new Error(`Error soft-deleting auditorium`);
            }
            return bookingDetails;
        }
        catch (error) {
            throw new Error(`Error soft-deleting auditorium: ${error}`);
        }
    }),
    findVendorByEmailService: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendor = yield vendorRepo_js_1.default.findVendorByEmail(email);
            return vendor;
        }
        catch (error) {
            console.error(error);
        }
    }),
    chatServices: (_a) => __awaiter(void 0, [_a], void 0, function* ({ vendorId }) {
        try {
            const chats = yield vendorRepo_js_1.default.chatDB(vendorId);
            return chats;
        }
        catch (error) {
            console.error("Error fetching chats:", error);
            throw error;
        }
    }),
    messageService: (_a) => __awaiter(void 0, [_a], void 0, function* ({ chatIds, vendorId, }) {
        try {
            const unreadCount = yield vendorRepo_js_1.default.messageDB(chatIds);
            index_js_1.io.to(vendorId).emit("unreadCount", { unreadCount });
            return unreadCount;
        }
        catch (error) {
            console.error("Error fetching unread messages:", error);
            throw error;
        }
    }),
};
// export const registerVendor = async (vendor: Vendor) => {
//   try {
//     const existingVendor = await findVendorByEmail(vendor.email);
//     console.log(existingVendor);
//     if (existingVendor) {
//       if (existingVendor.otpVerified) {
//         throw new Error("User already exists");
//       } else {
//         await updateVendor(existingVendor.email, vendor);
//         return existingVendor;
//       }
//     }
//     return await createVendor(vendor);
//   } catch (error) {
//     console.error("Error during user registration:", error);
//     throw error;
//   }
// };
// export const verifyAndSaveVendor = async (email: string, otp: string) => {
//   const vendor = await findVendorByEmail(email);
//   if (vendor && vendor.otp === otp) {
//     vendor.otp = undefined;
//     vendor.otpVerified = true;
//     await vendor.save();
//     return vendor;
//   }
//   throw new Error("Invalid OTP");
// };
// export const loginVendor = async (email: string, password: string) => {
//   const vendor = await findVendorByEmail(email);
//   if (!vendor) {
//     throw new Error("Invalid Email/Password");
//   }
//   const vendorToken = jwt.sign(
//     { vendorId: vendor._id },
//     process.env.JWT_SECRET!,
//     {
//       expiresIn: "1h",
//     }
//   );
//   return { vendor, vendorToken };
// };
// export const vendorAddress = async () => {
//   try {
//     return await vendorAddressFromDB();
//   } catch (error) {
//     throw new Error('Failed to fetch vendor addresses');
//   }
// };
// // service/vendorService.ts
// export const editVendorService = async (vendorDetails: Vendor, imageUrl: string | undefined) => {
//   try {
//     const existingVendor = await findVendorByEmailRepo(vendorDetails.email);
//     if (existingVendor) {
//       return await editVendorRepo(existingVendor, vendorDetails, imageUrl);
//     } else {
//       return await editVendorRepo(null, vendorDetails, imageUrl);
//     }
//   } catch (error) {
//     throw new Error('Failed to update vendor details');
//   }
// };
// export const uploadImage = async function (imageFile: IMulterFile): Promise<string> {
//   try {
//     console.log('first step');
//     const uploadedUrl = await uploadToS3Bucket([], imageFile);
//     return uploadedUrl;
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// };
// export const findVendorById = async (vendorId: string) => {
//   try {
//     const vendor = await findVendorByIdInDb(vendorId);
//     if (!vendor) {
//       throw new Error(`Error finding vendor`);
//     }
//     return vendor;
//   } catch (error) {
//     throw new Error(`Error finding vendor: ${error}`);
//   }
// };
// export const findAuditoriumById = async (auditoriumId: string) => {
//   try {
//     console.log('controller 2');
//     const vendor = await findAuditoriumByIdInDb(auditoriumId);
//     if(!vendor){
//       throw new Error(`Error finding vendor`);
//     }
//     return vendor;
//   } catch (error) {
//     throw new Error(`Error finding vendor: ${error}`);
//   }
// };
// export const findDishesById = async (dishesId: string) => {
//   try {
//     const vendor = await findDishesByIdInDb(dishesId);
//     if(!vendor){
//       throw new Error(`Error finding vendor`);
//     }
//     return vendor;
//   } catch (error) {
//     throw new Error(`Error finding vendor: ${error}`);
//   }
// };
// interface DishData {
//   dishesName: string;
//   description?: string;
//   menu: string;
//   types: string;
//   price: number;
//   category?: string;
//   status: string;
// }
// export const uploadDishes = async (
//   vendorId: string,
//   data: DishData,
//   images?: string
// ) => {
//   try {
//     const dishesData = { vendorId, data, images };
//     dishesData.data.price = Number(dishesData.data.price);
//     const newDish = await createDishes(dishesData);
//     return newDish;
//   } catch (error) {
//     console.error("Error in uploadDishes: ", error);
//     console.error();
//   }
// };
// interface AuditoriumData {
//   dishesName: string;
//   description?: string;
//   types: string;
//   price: number;
//   category?: string;
//   status: string;
//   capacity: number;
// }
// export const uploadAuditorium = async (
//   vendorId: string,
//   data: AuditoriumData,
//   image?: string
// ) => {
//   try {
//     const auditoriumData = { vendorId, data, image };
//     auditoriumData.data.price = Number(auditoriumData.data.price);
//     const newAuditorium = await createAuditorium(auditoriumData);
//     return newAuditorium;
//   } catch (error) {
//     console.error("Error in uploadAuditorium: ", error);
//     throw error;
//   }
// };
// export const findFoodVendorById = async (vendorId: string) => {
//   try {
//     console.log('Service invoked to find dishes for vendor:', vendorId);
//     const dishes = await findFoodVendorIdInDb(vendorId);
//     return dishes;
//   } catch (error) {
//     throw new Error(`Error finding vendor dishes: ${error}`);
//   }
// };
// export const findAuditoriumVendorById = async (vendorId: string) => {
//   try {
//     console.log('Service invoked to find auditorium for vendor:', vendorId);
//     const Auditorium = await findAuditoriumVendorIdInDb(vendorId);
//     return Auditorium;
//   } catch (error) {
//     throw new Error(`Error finding vendor dishes: ${error}`);
//   }
// };
// export const softDeleteDishService = async (dishId: string) => {
//   try {
//     const updatedDish = await softDeleteDishRepo(dishId);
//     if(!updatedDish){
//       throw new Error(`Error soft-deleting dish`);
//     }
//     return updatedDish;
//   } catch (error) {
//     throw new Error(`Error soft-deleting dish: ${error}`);
//   }
// };
// export const softDeleteAuditoriumService = async (auditoriumId: string) => {
//   try {
//     const updatedAuditorium = await softDeleteAuditoriumRepo(auditoriumId);
//     if(!updatedAuditorium){
//       throw new Error(`Error soft-deleting auditorium`);
//     }
//     return updatedAuditorium;
//   } catch (error) {
//     throw new Error(`Error soft-deleting auditorium: ${error}`);
//   }
// };
// export const findBookingDetails = async (vendorId: string) => {
//   try {
//     const bookingDetails = await findDetailsByvendorId(vendorId);
//     if(!bookingDetails){
//       throw new Error(`Error soft-deleting auditorium`);
//     }
//       return bookingDetails
//   } catch (error) {
//     throw new Error(`Error soft-deleting auditorium: ${error}`);
//   }
// }
// export const findVendorByEmailService = async (email: string) => {
//   try {
//     const vendor = await findVendorByEmail(email);
//     return vendor
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const chatServices = async ({ vendorId }: { vendorId: string }) => {
//   try {
//     const chats = await chatDB(vendorId);
//     return chats;
//   } catch (error) {
//     console.error("Error fetching chats:", error);
//     throw error;
//   }
// };
// export const messageService = async ({
//   chatIds,
//   vendorId,
// }: {
//   chatIds: string[];
//   vendorId: string;
// }) => {
//   try {
//     const unreadCount = await messageDB(chatIds);
//     io.to(vendorId).emit("unreadCount", { unreadCount });
//     return unreadCount;
//   } catch (error) {
//     console.error("Error fetching unread messages:", error);
//     throw error;
//   }
// };
