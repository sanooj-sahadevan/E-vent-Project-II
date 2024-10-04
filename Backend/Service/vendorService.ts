import { Vendor } from "../models/vendorModel";
import jwt from "jsonwebtoken";
import {
  createVendor, findVendorByEmail, findVendorByIdInDb, updateVendor, chatDB,
  vendorAddressFromDB, vendorEditFromDB, createDishes, createAuditorium, findDetailsByvendorId,
  findFoodVendorIdInDb, findAuditoriumVendorIdInDb, findDishesByIdInDb, findAuditoriumByIdInDb,
  softDeleteDishRepo, softDeleteAuditoriumRepo,
  messageDB,
} from "../Repository/vendorRepo.js";
import { uploadToS3Bucket } from "../middleware/fileUpload.js";
import { IMulterFile } from "../utils/type";
import { io } from "../index.js";




export const registerVendor = async (vendor: Vendor) => {
  try {
    const existingVendor = await findVendorByEmail(vendor.email);
    console.log(existingVendor);

    if (existingVendor) {
      if (existingVendor.otpVerified) {
        throw new Error("User already exists");
      } else {
        await updateVendor(existingVendor.email, vendor);
        return existingVendor;
      }
    }
    return await createVendor(vendor);
  } catch (error) {
    console.error("Error during user registration:", error);

    throw error;
  }
};

export const verifyAndSaveVendor = async (email: string, otp: string) => {
  const vendor = await findVendorByEmail(email);
  if (vendor && vendor.otp === otp) {
    vendor.otp = undefined;
    vendor.otpVerified = true;
    await vendor.save();
    return vendor;
  }
  throw new Error("Invalid OTP");
};

export const loginVendor = async (email: string, password: string) => {
  const vendor = await findVendorByEmail(email);
  if (!vendor) {
    throw new Error("Invalid Email/Password");
  }
  // const isPasswordValid = await bcrypt.compare(password, vendor.password);
  // if (!isPasswordValid) {
  //   throw new Error("Invalid Email/Password");
  // }

  console.log('jwt');

  const vendorToken = jwt.sign(
    { vendorId: vendor._id },

    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );
  return { vendor, vendorToken };
};

export const vendorAddress = async () => {
  try {
    return await vendorAddressFromDB();
  } catch (error) {
    throw new Error('Failed to fetch vendor addresses');
  }
};


export const editVendor = async (vendorDetails: Vendor, imageUrl: string | undefined) => {
  try {
    console.log('service');
    return await vendorEditFromDB(vendorDetails, imageUrl);
  } catch (error) {
    throw new Error('Failed to update vendor details');
  }
};


export const uploadImage = async function (imageFile: IMulterFile): Promise<string> {
  try {
    console.log('first step');

    const uploadedUrl = await uploadToS3Bucket([], imageFile);
    return uploadedUrl;
  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const findVendorById = async (vendorId: string) => {
  try {
    console.log('controller 2');
    const vendor = await findVendorByIdInDb(vendorId);
    return vendor;
  } catch (error) {
    throw new Error(`Error finding vendor: ${error}`);
  }
};

export const findAuditoriumById = async (auditoriumId: string) => {
  try {
    console.log('controller 2');
    const vendor = await findAuditoriumByIdInDb(auditoriumId);
    return vendor;
  } catch (error) {
    throw new Error(`Error finding vendor: ${error}`);
  }
};


export const findDishesById = async (dishesId: string) => {
  try {
    console.log('controller 2');
    const vendor = await findDishesByIdInDb(dishesId);
    return vendor;
  } catch (error) {
    throw new Error(`Error finding vendor: ${error}`);
  }
};



interface DishData {
  dishesName: string;
  description?: string;
  menu: string;
  types: string;
  price: number;
  category?: string;
  status: string;
}

export const uploadDishes = async (
  vendorId: string,
  data: DishData,
  images?: string
) => {
  try {
    const dishesData = { vendorId, data, images };

    // Ensure price is a number
    dishesData.data.price = Number(dishesData.data.price);

    const newDish = await createDishes(dishesData);

    return newDish;
  } catch (error) {
    console.error("Error in uploadDishes: ", error);
    console.error();
  }
};


interface AuditoriumData {
  dishesName: string;
  description?: string;
  types: string;
  price: number;
  category?: string;
  status: string;
  capacity: number;
}



export const uploadAuditorium = async (
  vendorId: string,
  data: AuditoriumData,
  image?: string
) => {
  try {
    const auditoriumData = { vendorId, data, image };
    auditoriumData.data.price = Number(auditoriumData.data.price);

    const newAuditorium = await createAuditorium(auditoriumData);

    return newAuditorium;
  } catch (error) {
    console.error("Error in uploadAuditorium: ", error);
    throw error;
  }
};



export const findFoodVendorById = async (vendorId: string) => {
  try {
    console.log('Service invoked to find dishes for vendor:', vendorId);
    const dishes = await findFoodVendorIdInDb(vendorId);
    return dishes;
  } catch (error) {
    throw new Error(`Error finding vendor dishes: ${error}`);
  }
};



export const findAuditoriumVendorById = async (vendorId: string) => {
  try {
    console.log('Service invoked to find auditorium for vendor:', vendorId);
    const Auditorium = await findAuditoriumVendorIdInDb(vendorId);
    return Auditorium;
  } catch (error) {
    throw new Error(`Error finding vendor dishes: ${error}`);
  }
};





export const softDeleteDishService = async (dishId: string) => {
  try {
    const updatedDish = await softDeleteDishRepo(dishId); 
    return updatedDish;
  } catch (error) {
    throw new Error(`Error soft-deleting dish: ${error}`);
  }
};




export const softDeleteAuditoriumService = async (auditoriumId: string) => {
  try {
    console.log('delete service');

    const updatedAuditorium = await softDeleteAuditoriumRepo(auditoriumId);
    return updatedAuditorium;
  } catch (error) {
    throw new Error(`Error soft-deleting auditorium: ${error}`);
  }
};


export const findBookingDetails = async (vendorId: string) => {
  console.log('Fetching booking details for userId:', vendorId);

  const bookingDetails = await findDetailsByvendorId(vendorId);
  console.log('Booking details:', bookingDetails);

  return bookingDetails;
};



export const findVendorByEmailService = async (email: string) => {
  try {
    const vendor = await findVendorByEmail(email);
    return vendor
  } catch (error) {
    console.error(error);

  }
};





export const chatServices = async ({ vendorId }: { vendorId: string }) => {
  try {
    const chats = await chatDB(vendorId);
    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
};

export const messageService = async ({
  chatIds,
  vendorId,
}: {
  chatIds: string[];
  vendorId: string;
}) => {
  try {
    const unreadCount = await messageDB(chatIds);

    io.to(vendorId).emit("unreadCount", { unreadCount });

    return unreadCount;
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    throw error;
  }
};
