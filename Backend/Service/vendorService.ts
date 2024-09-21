import { Vendor } from "../models/vendorModel";
import jwt from "jsonwebtoken";
import {
  createVendor,
  findVendorByEmail,
  findVendorByIdInDb,
  updateVendor, vendorAddressFromDB, vendorEditFromDB, createDishes, createAuditorium, findFoodVendorIdInDb, findAuditoriumVendorIdInDb, findDishesByIdInDb, findAuditoriumByIdInDb
} from "../Repository/vendorRepo.js";
import { uploadToS3Bucket } from "../middleware/fileUpload.js";
import { IMulterFile } from "../utils/type";

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

    //   const hashedPassword = await bcrypt.hash(vendor.password, 10);
    //   vendor.password = hashedPassword;

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
    return await vendorAddressFromDB(); // Fetch from the repository
  } catch (error) {
    throw new Error('Failed to fetch vendor addresses'); // Throw error to controller
  }
};


export const editVendor = async (vendorDetails: Vendor, imageUrl: string | undefined) => {
  try {
    console.log('service');

    // Pass both vendor details and image URL to the repository
    return await vendorEditFromDB(vendorDetails, imageUrl);
  } catch (error) {
    throw new Error('Failed to update vendor details');
  }
};


//   import { IMulterFile } from '../utils/type';
// import { uploadToS3Bucket } from '../repositories/s3Repository'; // Adjust the import path as needed
// import { IMulterFile } from '../utils/type';
// import { uploadToS3Bucket } from '../repositories/s3Repository'; // Adjust the import path as needed

export const uploadImage = async function (imageFile: IMulterFile): Promise<string> {
  try {
    console.log('first step');

    const uploadedUrl = await uploadToS3Bucket([imageFile], imageFile); // Pass both the array and file
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


import { Dishes } from '../models/dishesModel';

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