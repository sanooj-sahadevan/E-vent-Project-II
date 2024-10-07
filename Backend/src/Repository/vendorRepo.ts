import mongoose, { Document } from "mongoose";
import { DishDocument, Dishes } from '../models/dishesModel';
import { Auditorium } from "../models/auditoriumModel";
import { bookedModel } from "../models/bookedEvent";
import { chatModel } from "../models/chatModel";
import { messageModel } from "../models/messageModal";
import { VendorModel } from "../models/vendorModel";
import { Vendor } from '../interfaces/vendor'
import { IVendorRepository } from "../interfaces/repository/vendorRepository";




export class VendorRepository implements IVendorRepository {
  constructor() {
  }

  async createVendor(vendor: Vendor) : Promise<any>{
    try {
      const newVendor = new VendorModel(vendor);
      return newVendor.save();
    } catch (error) {
      throw new Error('Database Error');

    }

  }

  async findVendorByEmail(email: string) {
    try {
      return VendorModel.findOne({ email });
    } catch (error) {
      console.error(error);

    }
  }


  async updateVendor(email: string, update: Partial<Vendor>) {
    try {
      return VendorModel.findOneAndUpdate({ email }, update, { new: true });
    } catch (error) {
      console.error(error);

    }
  }

  async findVendorByEmailAndPassword(
    email: string,
    password: string
  ) {
    return VendorModel.findOne({ email, password });
  }


  async vendorAddressFromDB() {
    try {
      return await VendorModel.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new Error('Database query failed');
    }
  }

  async findVendorByEmailRepo(email: string): Promise<Vendor | null> {
    try {
      return await VendorModel.findOne({ email });
    } catch (error) {
      console.error('Error finding vendor by email:', error);
      throw new Error('Database operation failed');
    }
  }

  // Edit or create vendor in the database
  async editVendorRepo(
    existingVendor: Vendor | null,
    vendorDetails: Vendor,
    imageUrl: string | undefined
  ): Promise<Vendor> {
    try {
      if (existingVendor) {
        // Update existing vendor details
        existingVendor.vendorname = vendorDetails.vendorname;
        existingVendor.phone = vendorDetails.phone;
        existingVendor.address = vendorDetails.address;
        existingVendor.district = vendorDetails.district;
        existingVendor.state = vendorDetails.state;
        existingVendor.reviews = vendorDetails.reviews;

        // Update profile image if new image is uploaded
        if (imageUrl) {
          existingVendor.profileImage = imageUrl;
        }

        // Update password if provided
        if (vendorDetails.password) {
          existingVendor.password = vendorDetails.password;
        }

        // Save updated vendor
        await existingVendor.save();
        return existingVendor;
      } else {
        // If vendor doesn't exist, create a new one
        const newVendor = new VendorModel({
          ...vendorDetails,
          profileImage: imageUrl || vendorDetails.profileImage
        });
        await newVendor.save();
        return newVendor;
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
      throw new Error('Database operation failed');
    }
  }


  // export const uploadImage = async function (imageFile: IMulterFile): Promise<string> {
  //   try {
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // };


  async findVendorByIdInDb(vendorId: string) {
    return await VendorModel.findById(vendorId);
  }

  async findAuditoriumByIdInDb(auditoriumId: string) {
    console.log(auditoriumId);

    let result = await Auditorium.findById(auditoriumId);
    console.log(result);
    return result
  }

  async findDishesByIdInDb(dishesId: string) {
    try {
      return await Dishes.findById(dishesId);
    } catch (error) {
      console.error(error);
    }
  }

  async findFoodVendorIdInDb(vendorId: string) {
    try {
      const result = await Dishes.find({ vendorId: vendorId });
      return result
    } catch (error) {
      console.error(error);

    }
  }



  async findAuditoriumVendorIdInDb(vendorId: string) {
    try {
      const res = await Auditorium.find({ vendorId: vendorId });
      return res
    } catch (error) {
      console.error(error);

    }
  }


  async createDishes(dishesData: any) {
    try {
      const dish = new Dishes({
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
      const savedDish = await dish.save();
      console.log("Saved Dish: ", savedDish);

      return {
        savedDish,
        vendorId: dishesData.vendorId,
      };
    } catch (error) {
      console.error("Error saving dish: ", error);
      throw error;
    }
  }



  async createAuditorium(auditoriumData: any) {
    try {
      const auditorium = new Auditorium({
        vendorId: auditoriumData.vendorId,
        auditoriumName: auditoriumData.data.auditoriumName,
        description: auditoriumData.data.description,
        types: auditoriumData.data.types,
        price: auditoriumData.data.price,
        category: auditoriumData.data.category,
        status: auditoriumData.data.status,
        images: auditoriumData.image ? [auditoriumData.image] : [], // Handle single image as array
        capacity: auditoriumData.data.capacity,
      });

      const savedAuditorium = await auditorium.save();
      console.log("Saved Auditorium: ", savedAuditorium);

      return {
        savedAuditorium,
        vendorId: auditoriumData.vendorId,
      };
    } catch (error) {
      console.error("Error saving auditorium: ", error);
      throw error;
    }
  }




  async softDeleteDishRepo(dishId: string): Promise<DishDocument | null> {
    try {
      const dish = await Dishes.findById(dishId);
      if (!dish || dish.isDeleted) {
        return null;
      }
      dish.isDeleted = true;
      await dish.save();
      return dish;
    } catch (error) {
      console.error(`Error soft-deleting dish: ${error}`);
      throw error;
    }
  }





  async softDeleteAuditoriumRepo(auditoriumId: string) {
    try {
      const auditorium = await Auditorium.findById(auditoriumId);
      console.log(auditorium);
      if (!auditorium || auditorium.isDeleted) {
        return null;
      }
      auditorium.isDeleted = true;
      await auditorium.save();
      return auditorium;
    } catch (error) {
      console.error(`Error soft-deleting auditorium: ${error}`);
      throw error;
    }
  }


  async findDetailsByvendorId(vendorId: string) {
    try {
      const results = await bookedModel
        .find({ vendorId: vendorId })
        .populate('dishesId')
        .populate('userId')
        .populate('vendorId')
        .populate('auditoriumId');
      console.log('Fetched Data with populated fields:', results);
      return results;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Database operation failed.");
    }
  }




  async chatDB(vendorId: string) {
    try {
      const chats = await chatModel.find({ vendorId }).select('_id');
      return chats;
    } catch (error) {
      console.error("Error fetching chats from the database:", error);
      throw error;
    }
  }

  async messageDB(chatIds: string[]) {
    try {
      const unreadCount = await messageModel.countDocuments({
        chatId: { $in: chatIds },
        senderModel: "User",
        isRead: false,
      });

      return unreadCount;
    } catch (error) {
      console.error("Error fetching unread messages count from the database:", error);
      throw error;
    }
  }
}



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

