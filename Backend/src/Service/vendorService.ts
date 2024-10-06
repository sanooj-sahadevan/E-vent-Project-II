import jwt from "jsonwebtoken";
import vendorRepositary from "../Repository/vendorRepo.js"
import { Vendor } from "../interfaces/vendor.js";
import { uploadToS3Bucket } from "../middleware/fileUpload.js";
import { IMulterFile } from "../utils/type.js";
import { io } from "../../index.js";
import { DishDocument } from "../interfaces/dishes.js";
import { AuditoriumDocument } from "../models/auditoriumModel.js";


export default {

registerVendor : async (vendor: Vendor) => {
    try {
      const existingVendor = await vendorRepositary.findVendorByEmail(vendor.email);
      console.log(existingVendor);
  
      if (existingVendor) {
        if (existingVendor.otpVerified) {
          throw new Error("User already exists");
        } else {
          await vendorRepositary.updateVendor(existingVendor.email, vendor);
          return existingVendor;
        }
      }
      return await vendorRepositary.createVendor(vendor);
    } catch (error) {
      console.error("Error during user registration:", error);
  
      throw error;
    }
  },
  
  verifyAndSaveVendor : async (email: string, otp: string) => {
    const vendor = await vendorRepositary.findVendorByEmail(email);
    if (vendor && vendor.otp === otp) {
      vendor.otp = undefined;
      vendor.otpVerified = true;
      await vendor.save();
      return vendor;
    }
    throw new Error("Invalid OTP");
  },

  loginVendor : async (email: string, password: string) => {
    const vendor = await vendorRepositary.findVendorByEmail(email);
    if (!vendor) {
      throw new Error("Invalid Email/Password");
    }
  
    const vendorToken = jwt.sign(
      { vendorId: vendor._id },
  
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );
    return { vendor, vendorToken };
  },

  vendorAddress : async () => {
    try {
      return await vendorRepositary.vendorAddressFromDB();
    } catch (error) {
      throw new Error('Failed to fetch vendor addresses');
    }
  },
  
  
  editVendorService : async (vendorDetails: Vendor, imageUrl: string | undefined) => {
    try {
      const existingVendor = await vendorRepositary.findVendorByEmailRepo(vendorDetails.email);
  
      if (existingVendor) {
        return await vendorRepositary.editVendorRepo(existingVendor, vendorDetails, imageUrl);
      } else {
        return await vendorRepositary.editVendorRepo(null, vendorDetails, imageUrl);
      }
    } catch (error) {
      throw new Error('Failed to update vendor details');
    }
  },
  
  
uploadImage : async function (imageFile: IMulterFile): Promise<string> {
    try {
      console.log('first step');
  
      const uploadedUrl = await uploadToS3Bucket([], imageFile);
      return uploadedUrl;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  
  
  findVendorById : async (vendorId: string) => {
    try {
      const vendor = await vendorRepositary.findVendorByIdInDb(vendorId);
      if (!vendor) {
        throw new Error(`Error finding vendor`);
      }
      return vendor;
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  },

 findAuditoriumById : async (auditoriumId: string) => {
    try {
      console.log('controller 2');
      const vendor = await vendorRepositary.findAuditoriumByIdInDb(auditoriumId);
      if(!vendor){
        throw new Error(`Error finding vendor`);
      }
      return vendor;
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  },
  
  
   findDishesById : async (dishesId: string) => {
    try {
      
      const vendor = await vendorRepositary.findDishesByIdInDb(dishesId);
      if(!vendor){
        throw new Error(`Error finding vendor`);
      }
      return vendor;
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  },
  
   uploadDishes : async (
    vendorId: string,
    data: DishDocument,
    images?: string
  ) => {
    try {
      console.log('duisg servuive');
      
      const dishesData = { vendorId, data, images };
  
      dishesData.data.price = Number(dishesData.data.price);
  
      const newDish = await vendorRepositary.createDishes(dishesData);
  console.log(newDish);
  
      return newDish;
    } catch (error) {
      console.error("Error in uploadDishes: ", error);
      console.error();
    }
  },
  
  
 uploadAuditorium : async (
    vendorId: string,
    data: AuditoriumDocument,
    image?: string
  ) => {
    try {
      const auditoriumData = { vendorId, data, image };
      auditoriumData.data.price = Number(auditoriumData.data.price);
  
      const newAuditorium = await vendorRepositary.createAuditorium(auditoriumData);
  
      return newAuditorium;
    } catch (error) {
      console.error("Error in uploadAuditorium: ", error);
      throw error;
    }
  },
  
  
  findFoodVendorById : async (vendorId: string) => {
    try {
      console.log('Service invoked to find dishes for vendor:', vendorId);
      const dishes = await vendorRepositary.findFoodVendorIdInDb(vendorId);
      return dishes;
    } catch (error) {
      throw new Error(`Error finding vendor dishes: ${error}`);
    }
  },
  
  
  
  findAuditoriumVendorById : async (vendorId: string) => {
    try {
      console.log('Service invoked to find auditorium for vendor:', vendorId);
      const Auditorium = await vendorRepositary.findAuditoriumVendorIdInDb(vendorId);
      return Auditorium;
    } catch (error) {
      throw new Error(`Error finding vendor dishes: ${error}`);
    }
  },
  
  
  
  
  
softDeleteDishService :async (dishId: string) => {
    try {
      const updatedDish = await vendorRepositary.softDeleteDishRepo(dishId);
      if(!updatedDish){
        throw new Error(`Error soft-deleting dish`);
      }
      return updatedDish;
    } catch (error) {
      throw new Error(`Error soft-deleting dish: ${error}`);
    }
  },
  
  
  
  softDeleteAuditoriumService : async (auditoriumId: string) => {
    try {
      const updatedAuditorium = await vendorRepositary.softDeleteAuditoriumRepo(auditoriumId);
      if(!updatedAuditorium){
        throw new Error(`Error soft-deleting auditorium`);
      }
      return updatedAuditorium;
    } catch (error) {
      throw new Error(`Error soft-deleting auditorium: ${error}`);
    }
  },
  
  
  findBookingDetails : async (vendorId: string) => {
    try {
      const bookingDetails = await vendorRepositary.findDetailsByvendorId(vendorId);
      if(!bookingDetails){
        throw new Error(`Error soft-deleting auditorium`);
      }
        return bookingDetails
    } catch (error) {
      throw new Error(`Error soft-deleting auditorium: ${error}`);
  
    }
  },
  
  
  
  
  findVendorByEmailService : async (email: string) => {
    try {
      const vendor = await vendorRepositary.findVendorByEmail(email);
      return vendor
    } catch (error) {
      console.error(error);
  
    }
  },
  
  
  
chatServices : async ({ vendorId }: { vendorId: string }) => {
    try {
      const chats = await vendorRepositary.chatDB(vendorId);
      return chats;
    } catch (error) {
      console.error("Error fetching chats:", error);
      throw error;
    }
  },

  messageService : async ({
    chatIds,
    vendorId,
  }: {
    chatIds: string[];
    vendorId: string;
  }) => {
    try {
      const unreadCount = await vendorRepositary.messageDB(chatIds);
  
      io.to(vendorId).emit("unreadCount", { unreadCount });
  
      return unreadCount;
    } catch (error) {
      console.error("Error fetching unread messages:", error);
      throw error;
    }
  },
  
}
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
