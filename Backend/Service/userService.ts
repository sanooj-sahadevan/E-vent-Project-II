import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


import {
  createUser,userEditFromDB,updateUser,
  findUserByEmailupdate,fetchfromDBDishes,VendorRepository,
  fetchfromDBAuditorium,findVendorByIdInDb,findUserByEmail,
  findAuditoriumByIdInDb,getBookingDetail,findFoodVendorIdInDb,
  findAuditoriumVendorIdInDb,finddishesByIdInDb,saveBookingDetailsInDB
} from "../Repository/userReop.js";

export const registerUser = async (user: User) => {
  try {

    console.log('service');

    const existingUser = await findUserByEmail(user.email);

    if (existingUser) {
      if (existingUser.otpVerified) {
        throw new Error("User already exists");
      } else {
        await updateUser(existingUser.email, user);
        return existingUser;
      }
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    return await createUser(user);
  } catch (error) {
    console.error("Error during user registration:", error);
    throw new Error(`Registration error: ${(error as Error).message}`);
  }
};


export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid Email/Password");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid Email/Password");
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  // const secret: string | undefined = process.env.JWT_SECRET;
  // if (!secret) throw new Error("JWT Secret not found");
  // const data = { user, role: "travelie-user" };
  // const token = jwt.sign(data, secret, {
  //   expiresIn: "1h",
  // });
  return { user, token };
};


export const checkEmail = async (email: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error('User not found'); // Error handling if the user is not found
  }
  return { user };
};


export const verifyAndSaveUser = async (email: string, otp: string) => {
  const user = await findUserByEmail(email);
  if (user && user.otp === otp) {
    user.otp = undefined;
    user.otpVerified = true;
    await user.save();
    return user;
  }
  throw new Error("Invalid OTP");
};


export const update = async (email: string, password: string) => {
 try {
  console.log('Service: Calling repository to update password');
  const user = await findUserByEmailupdate(email, password);
  return user; 
 } catch (error) {
  console.error(error);
  
 }
};


const vendorRepository = new VendorRepository();

export const getAllVendors = async (): Promise<any[]> => {
  try {
    return await vendorRepository.getAllVendors();     
  } catch (error) {
    throw new Error('Error fetching vendors'); 
  }
};



export const getAllDishes = async (vendorId: string): Promise<any[]> => {
  try {
    console.log('Service: Fetching dishes');
    const result = await fetchfromDBDishes(vendorId); 
    return result;
  } catch (error) {
    throw new Error('Error fetching dishes');
  }
};

export const getAllAuditorium = async (vendorId: string): Promise<any[]> => {
  try {
    console.log('Service: Fetching auditoriums for vendor:', vendorId);
    const result = await fetchfromDBAuditorium(vendorId); 
    return result;
  } catch (error) {
    throw new Error('Error fetching auditoriums');
  }
};


export const editUser = async (userDetails: User) => { 
  try {
    return await userEditFromDB(userDetails); 
  } catch (error) {
    throw new Error('Failed to update user details');
  }
};


export const findVendorById = async (vendorId: string) => {
  try {
    console.log('controller 2  user service');
    const vendor = await findVendorByIdInDb(vendorId);
    return vendor;
  } catch (error) {
    throw new Error(`Error finding vendor: ${error}`);
  }
};


export const findFoodVendorById = async (vendorId: string) => {
  try {
    console.log('Service invoked to find dishes for vendor:', vendorId);
    const dishes = await findFoodVendorIdInDb(vendorId);  // Call the repo to fetch dishes
    return dishes;
  } catch (error) {
    throw new Error(`Error finding vendor dishes: ${error}`);
  }
};

export const findAuditoriumVendorById = async (vendorId: string) => {
  try {
    console.log('Service invoked to find dishes for vendor:', vendorId);
    const dishes = await findAuditoriumVendorIdInDb(vendorId);  
    return dishes;
  } catch (error) {
    throw new Error(`Error finding vendor dishes: ${error}`);
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



export const finddishesById = async (dishesId: string) => {
  try {
    console.log('controller 2');
    const vendor = await finddishesByIdInDb(dishesId);
    return vendor;
  } catch (error) {
    throw new Error(`Error finding vendor: ${error}`);
  }
};


export const saveDatabase = async (bookingDetails: Object) => {
  try {
    const savedBooking = await saveBookingDetailsInDB(bookingDetails); // Pass the booking details
    return savedBooking;
  } catch (error) {
    throw new Error(`Error saving booking details: ${error}`);
  }
};



export const findEvent = async (bookingId: string) => {
  try {
    const bookingDetails = await getBookingDetail(bookingId);
    return bookingDetails;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error;
  }
};


export const addTransactionDetails = async (
  email: string,
  PayUOrderId: string,
  status: "success" | "failed"
) => {
  try {
    // const PayUOrderData = await PayURepository.getPayUOrder(PayUOrderId);
    // if (!PayUOrderData) throw new Error("PayU Order Data not found");
    // console.log("Got order id");
    // console.log(PayUOrderData);

    // const userData = await userServices.getUserDataByEmail(email);
    // if (!userData) throw new Error("User Data not found.");
    // const userId = userData._id.toString();

    // const transaction = await adsRepository.addTransaction(
    //   userId,
    //   PayUOrderId,
    //   PayUOrderData.mihpayid,
    //   status,
    //   PayUOrderData.amount
    // );
    // console.log("Added transaction");
    // console.log(transaction);
    // if (!transaction) throw new Error("Transaction Data not found");

    // if (status === "success") {
    //   const postId = PayUOrderData?.productinfo;
    //   const WeNetAdsData = await adsRepository.createWenetAds(
    //     userId,
    //     postId,
    //     transaction._id.toString()
    //   );
    //   console.log("created WeNetAdsData");
    //   console.log(WeNetAdsData);

    //   const postData = await adsRepository.addAdDataToPost(postId);
    //   console.log("Added ad data to post ");
    //   console.log(postData);

    //   try {
    //     await adsRepository.sendPostAdDataToMQ(
    //       postData._id.toString(),
    //       postData.WeNetAds
    //     );
    //   } catch (error: any) {
    //     console.log(error.message);
    //   }
    // }
    // return transaction._id.toString();
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// export const fetchbookingData = async (txnid: string, productinfo: string, status: string) => {

//   const bookedTrip = await updateBookedTrip(productinfo, txnid, status);
//   return bookedTrip;
// };