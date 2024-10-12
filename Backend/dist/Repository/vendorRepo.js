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
exports.VendorRepository = void 0;
const dishesModel_1 = require("../models/dishesModel");
const auditoriumModel_1 = require("../models/auditoriumModel");
const bookedEvent_1 = require("../models/bookedEvent");
const chatModel_1 = require("../models/chatModel");
const messageModal_1 = require("../models/messageModal");
const vendorModel_1 = require("../models/vendorModel");
const reviews_1 = require("../models/reviews");
class VendorRepository {
    constructor() {
    }
    createVendor(vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newVendor = new vendorModel_1.VendorModel(vendor);
                return newVendor.save();
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    findVendorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return vendorModel_1.VendorModel.findOne({ email });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    updateVendor(email, update) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return vendorModel_1.VendorModel.findOneAndUpdate({ email }, update, { new: true });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    findVendorByEmailAndPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return vendorModel_1.VendorModel.findOne({ email, password });
        });
    }
    vendorAddressFromDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield vendorModel_1.VendorModel.find().sort({ createdAt: -1 });
            }
            catch (error) {
                throw new Error('Database query failed');
            }
        });
    }
    findVendorByEmailRepo(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield vendorModel_1.VendorModel.findOne({ email });
            }
            catch (error) {
                console.error('Error finding vendor by email:', error);
                throw new Error('Database operation failed');
            }
        });
    }
    editVendorRepo(existingVendor, vendorDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (existingVendor) {
                    existingVendor.vendorname = vendorDetails.vendorname;
                    existingVendor.phone = vendorDetails.phone;
                    existingVendor.address = vendorDetails.address;
                    existingVendor.district = vendorDetails.district;
                    existingVendor.state = vendorDetails.state;
                    existingVendor.reviews = vendorDetails.reviews;
                    existingVendor.profileImage = vendorDetails.profileImage || existingVendor.profileImage;
                    yield existingVendor.save();
                    return existingVendor;
                }
                else {
                    const newVendor = new vendorModel_1.VendorModel(Object.assign(Object.assign({}, vendorDetails), { profileImage: vendorDetails.profileImage }));
                    yield newVendor.save();
                    return newVendor;
                }
            }
            catch (error) {
                console.error('Error in editVendorRepo:', error);
                throw new Error('Database operation failed');
            }
        });
    }
    findVendorByIdInDb(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vendorModel_1.VendorModel.findById(vendorId);
        });
    }
    findAuditoriumByIdInDb(auditoriumId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield auditoriumModel_1.Auditorium.findById(auditoriumId);
            return result;
        });
    }
    findDishesByIdInDb(dishesId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield dishesModel_1.Dishes.findById(dishesId);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    findFoodVendorIdInDb(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dishesModel_1.Dishes
                    .find({ vendorId: vendorId });
                return result;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    findReviewsVendorIdInDb(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield reviews_1.Reviews
                    .find({ vendorId: vendorId })
                    .populate('userId')
                    .exec();
                return result;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    findAuditoriumVendorIdInDb(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield auditoriumModel_1.Auditorium.find({ vendorId: vendorId });
                return res;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    createDishes(dishesData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dish = new dishesModel_1.Dishes({
                    vendorId: dishesData.vendorId,
                    dishesName: dishesData.data.dishesName,
                    description: dishesData.data.description,
                    menu: dishesData.data.menu,
                    types: dishesData.data.types,
                    price: dishesData.data.price,
                    category: dishesData.data.category,
                    status: dishesData.data.status,
                    images: dishesData.images,
                });
                const savedDish = yield dish.save();
                console.log("Saved Dish: ", savedDish);
                return {
                    savedDish,
                    vendorId: dishesData.vendorId,
                };
            }
            catch (error) {
                console.error("Error saving dish: ", error);
                throw error;
            }
        });
    }
    createAuditorium(auditoriumData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auditorium = new auditoriumModel_1.Auditorium({
                    vendorId: auditoriumData.vendorId,
                    auditoriumName: auditoriumData.data.auditoriumName,
                    description: auditoriumData.data.description,
                    types: auditoriumData.data.types,
                    price: auditoriumData.data.price,
                    category: auditoriumData.data.category,
                    status: auditoriumData.data.status,
                    images: auditoriumData.images,
                    capacity: auditoriumData.data.capacity,
                });
                const savedAuditorium = yield auditorium.save();
                console.log("Saved Auditorium: ", savedAuditorium);
                return {
                    savedAuditorium,
                    vendorId: auditoriumData.vendorId,
                };
            }
            catch (error) {
                console.error("Error saving auditorium: ", error);
                throw error;
            }
        });
    }
    softDeleteDishRepo(dishId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dish = yield dishesModel_1.Dishes.findById(dishId);
                if (!dish || dish.isDeleted) {
                    return null;
                }
                dish.isDeleted = true;
                yield dish.save();
                return dish;
            }
            catch (error) {
                console.error(`Error soft-deleting dish: ${error}`);
                throw error;
            }
        });
    }
    softDeleteAuditoriumRepo(auditoriumId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auditorium = yield auditoriumModel_1.Auditorium.findById(auditoriumId);
                console.log(auditorium);
                if (!auditorium || auditorium.isDeleted) {
                    return null;
                }
                auditorium.isDeleted = true;
                yield auditorium.save();
                return auditorium;
            }
            catch (error) {
                console.error(`Error soft-deleting auditorium: ${error}`);
                throw error;
            }
        });
    }
    updatedreviewRepo(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield reviews_1.Reviews.findById(reviewId);
                console.log(review);
                if (!review || review.vendorVerified) {
                    return null;
                }
                review.vendorVerified = true;
                yield review.save();
                console.log(review);
                return review;
            }
            catch (error) {
                console.error(`Error soft-deleting auditorium: ${error}`);
                throw error;
            }
        });
    }
    updatedreviewRepoReject(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield reviews_1.Reviews.findById(reviewId);
                if (!review) {
                    console.log('Review not found');
                    return null;
                }
                yield reviews_1.Reviews.findByIdAndDelete(reviewId);
                console.log(`Review with ID ${reviewId} deleted successfully.`);
                return review;
            }
            catch (error) {
                console.error(`Error deleting review: ${error}`);
                throw error;
            }
        });
    }
    findDetailsByvendorId(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield bookedEvent_1.bookedModel
                    .find({ vendorId: vendorId })
                    .populate('dishesId')
                    .populate('userId')
                    .populate('vendorId')
                    .populate('auditoriumId');
                console.log('Fetched Data with populated fields:', results);
                return results;
            }
            catch (error) {
                console.error("Database error:", error);
                throw new Error("Database operation failed.");
            }
        });
    }
    chatDB(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chats = yield chatModel_1.chatModel.find({ vendorId }).select('_id');
                return chats;
            }
            catch (error) {
                console.error("Error fetching chats from the database:", error);
                throw error;
            }
        });
    }
    messageDB(chatIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unreadCount = yield messageModal_1.messageModel.countDocuments({
                    chatId: { $in: chatIds },
                    senderModel: "User",
                    isRead: false,
                });
                return unreadCount;
            }
            catch (error) {
                console.error("Error fetching unread messages count from the database:", error);
                throw error;
            }
        });
    }
}
exports.VendorRepository = VendorRepository;
// export const createVendor = async (vendor: Vendor) => {
//   try {
//     const newVendor = new VendorModel(vendor);
//     return newVendor.save();
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const findVendorByEmail = async (email: string) => {
//   try {
//     return VendorModel.findOne({ email });
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const updateVendor = async (email: string, update: Partial<Vendor>) => {
//   try {
//     return VendorModel.findOneAndUpdate({ email }, update, { new: true });
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const findVendorByEmailAndPassword = async (
//   email: string,
//   password: string
// ) => {
//   return VendorModel.findOne({ email, password });
// };
// export const vendorAddressFromDB = async () => {
//   try {
//     return await VendorModel.find().sort({ createdAt: -1 });
//   } catch (error) {
//     throw new Error('Database query failed');
//   }
// };
// export const findVendorByEmailRepo = async (email: string): Promise<Vendor | null> => {
//   try {
//     return await VendorModel.findOne({ email });
//   } catch (error) {
//     console.error('Error finding vendor by email:', error);
//     throw new Error('Database operation failed');
//   }
// };
// // Edit or create vendor in the database
// export const editVendorRepo = async (
//   existingVendor: Vendor | null,
//   vendorDetails: Vendor,
//   imageUrl: string | undefined
// ): Promise<Vendor> => {
//   try {
//     if (existingVendor) {
//       // Update existing vendor details
//       existingVendor.vendorname = vendorDetails.vendorname;
//       existingVendor.phone = vendorDetails.phone;
//       existingVendor.address = vendorDetails.address;
//       existingVendor.district = vendorDetails.district;
//       existingVendor.state = vendorDetails.state;
//       existingVendor.reviews = vendorDetails.reviews;
//       // Update profile image if new image is uploaded
//       if (imageUrl) {
//         existingVendor.profileImage = imageUrl;
//       }
//       // Update password if provided
//       if (vendorDetails.password) {
//         existingVendor.password = vendorDetails.password;
//       }
//       // Save updated vendor
//       await existingVendor.save();
//       return existingVendor;
//     } else {
//       // If vendor doesn't exist, create a new one
//       const newVendor = new VendorModel({
//         ...vendorDetails,
//         profileImage: imageUrl || vendorDetails.profileImage
//       });
//       await newVendor.save();
//       return newVendor;
//     }
//   } catch (error) {
//     console.error('Error updating vendor:', error);
//     throw new Error('Database operation failed');
//   }
// };
// // export const uploadImage = async function (imageFile: IMulterFile): Promise<string> {
// //   try {
// //   } catch (error: any) {
// //     throw new Error(error.message);
// //   }
// // };
// export const findVendorByIdInDb = async (vendorId: string) => {
//   return await VendorModel.findById(vendorId);
// };
// export const findAuditoriumByIdInDb = async (auditoriumId: string) => {
//   console.log(auditoriumId);
//   let result = await Auditorium.findById(auditoriumId);
//   console.log(result);
//   return result
// };
// export const findDishesByIdInDb = async (dishesId: string) => {
//   try {
//     return await Dishes.findById(dishesId);
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const findFoodVendorIdInDb = async (vendorId: string) => {
//   try {
//     const result = await Dishes.find({ vendorId: vendorId });
//     return result
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const findAuditoriumVendorIdInDb = async (vendorId: string) => {
//   try {
//     const res = await Auditorium.find({ vendorId: vendorId });
//     return res
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const createDishes = async (dishesData: any) => {
//   try {
//     const dish = new Dishes({
//       vendorId: dishesData.vendorId,
//       dishesName: dishesData.data.dishesName,
//       description: dishesData.data.description,
//       menu: dishesData.data.menu,
//       types: dishesData.data.types,
//       price: dishesData.data.price,
//       category: dishesData.data.category,
//       status: dishesData.data.status,
//       images: dishesData.images,
//     });
//     // Save the Dishes to the database
//     const savedDish = await dish.save();
//     console.log("Saved Dish: ", savedDish);
//     return savedDish;
//   } catch (error) {
//     console.error("Error saving dish: ", error);
//     throw error;
//   }
// };
// export const createAuditorium = async (auditoriumData: any) => {
//   try {
//     const auditorium = new Auditorium({
//       vendorId: auditoriumData.vendorId,
//       auditoriumName: auditoriumData.data.auditoriumName,
//       description: auditoriumData.data.description,
//       types: auditoriumData.data.types,
//       price: auditoriumData.data.price,
//       category: auditoriumData.data.category,
//       status: auditoriumData.data.status,
//       images: auditoriumData.image ? [auditoriumData.image] : [], // Handle single image as array
//       capacity: auditoriumData.data.capacity,
//     });
//     const savedAuditorium = await auditorium.save();
//     console.log("Saved Auditorium: ", savedAuditorium);
//     return {
//       savedAuditorium,
//       vendorId: auditoriumData.vendorId,
//     };
//   } catch (error) {
//     console.error("Error saving auditorium: ", error);
//     throw error;
//   }
// };
// export const softDeleteDishRepo = async (dishId: string): Promise<DishDocument | null> => {
//   try {
//     const dish = await Dishes.findById(dishId);
//     if (!dish || dish.isDeleted) {
//       return null;
//     }
//     dish.isDeleted = true;
//     await dish.save();
//     return dish;
//   } catch (error) {
//     console.error(`Error soft-deleting dish: ${error}`);
//     throw error;
//   }
// };
// export const softDeleteAuditoriumRepo = async (auditoriumId: string) => {
//   try {
//     const auditorium = await Auditorium.findById(auditoriumId);
//     console.log(auditorium);
//     if (!auditorium || auditorium.isDeleted) {
//       return null;
//     }
//     auditorium.isDeleted = true;
//     await auditorium.save();
//     return auditorium;
//   } catch (error) {
//     console.error(`Error soft-deleting auditorium: ${error}`);
//     throw error;
//   }
// };
// export const findDetailsByvendorId = async (vendorId: string) => {
//   try {
//     const results = await bookedModel
//       .find({ vendorId: vendorId })
//       .populate('dishesId')
//       .populate('userId')
//       .populate('vendorId')
//       .populate('auditoriumId');
//     console.log('Fetched Data with populated fields:', results);
//     return results;
//   } catch (error) {
//     console.error("Database error:", error);
//     throw new Error("Database operation failed.");
//   }
// };
// export const chatDB = async (vendorId: string) => {
//   try {
//     const chats = await chatModel.find({ vendorId }).select('_id');
//     return chats;
//   } catch (error) {
//     console.error("Error fetching chats from the database:", error);
//     throw error;
//   }
// };
// export const messageDB = async (chatIds: string[]) => {
//   try {
//     const unreadCount = await messageModel.countDocuments({
//       chatId: { $in: chatIds },
//       senderModel: "User",
//       isRead: false,
//     });
//     return unreadCount;
//   } catch (error) {
//     console.error("Error fetching unread messages count from the database:", error);
//     throw error;
//   }
// };
// export { VendorModel };
