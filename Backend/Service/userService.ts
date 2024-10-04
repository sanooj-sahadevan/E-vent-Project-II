import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import { HttpStatus } from '../utils/httpStatus.js'
import { otpGenerator } from "../utils/otpGenerator.js";
import jsSHA from "jssha";


import {
  createUser, userEditFromDB, updateUser, createBookedTrip,
  findUserByEmailupdate, fetchfromDBDishes, VendorRepository,
  fetchfromDBAuditorium, findVendorByIdInDb, findUserByEmail,
  findAuditoriumByIdInDb, getBookingDetail, findFoodVendorIdInDb,
  findAuditoriumVendorIdInDb, finddishesByIdInDb, findDetailsByUserId, changepassword,
} from "../Repository/userReop.js";



export const registerUser = async (user: any) => {
  try {
    console.log('Service register:', user.email);

    // Check if the user already exists in the database
    const existingUser = await findUserByEmail(user.email);

    if (existingUser) {
      if (existingUser.otpVerified) {
        throw new Error("User already exists and is verified.");
      } else {
        // Update the user's OTP and other fields if they exist but are not verified
        console.log('Updating existing user with new OTP:', user.otp);
        await updateUser(existingUser.email, { otp: user.otp, ...user });
        return existingUser;
      }
    }

    // Hash the password for a new user
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    // Save the new user with the generated OTP
    console.log('Creating new user with OTP:', user.otp);
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
  return { user, token };
};

export const checkEmail = async (email: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }
  const otp = otpGenerator();
  await sendEmail(email, otp);
  return { user, otp };
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


export const editUser = async (userDetails: any) => {
  try {
    return await userEditFromDB(userDetails);
  } catch (error) {
    throw new Error('Failed to update user details');
  }
};



export const findVendorById = async (vendorId: string, userId: string) => {
  try {
    const { vendor, chatId } = await findVendorByIdInDb(vendorId, userId);  // Fetch vendor and chatId from DB
    return {
      vendor,
      chatId
    };
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






export const findEvent = async (bookingId: string) => {
  try {
    console.log('controler 2');

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

export const fetchbookingData = async (bookingData: any) => {
  console.log('service');
  const bookedTrip = await createBookedTrip(bookingData);
  console.log(bookedTrip);
  return bookedTrip;
};



export const findBookingDetails = async (userId: string) => {
  console.log('Fetching booking details for userId:', userId);

  const bookingDetails = await findDetailsByUserId(userId); // Use the repository function
  console.log('Booking details:', bookingDetails);

  return bookingDetails; // Return the booking details
};


export const findchangePassword = async (userId: string, newPassword: string) => {
  console.log('Updating password for userId:', userId);
  const updatedPassword = await changepassword(userId, newPassword);
  return updatedPassword;
};


export const findUserByEmailService = async (email: string) => {
  try {
    const user = await findUserByEmail(email);
    console.log('otp service');

    return { user, email };
  } catch (error) {
    console.error(error);
  }
};




export const generateOtp = () => {
  const otp = otpGenerator();  // Assuming this is synchronous
  console.log(otp, "OTP-------------------");
  return otp;
};



export const generatesendEmail= async (email:string,otp:any) => {
  try {
    const result = sendEmail(email,otp);
    console.log(result);

  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP.");
  }
};


export const generatePaymentHash = async ({
  txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6
}: {
  txnid: string,
  amount: string,
  productinfo: string,
  username: string,
  email: string,
  udf1: string,
  udf2: string,
  udf3: string,
  udf4: string,
  udf5: string,
  udf6: string
}) => {
  try {
    const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${username}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|||||${process.env.PAYU_SALT}`;

    // Generate hash using SHA-512
    const sha = new jsSHA("SHA-512", "TEXT");
    sha.update(hashString);
    const hash = sha.getHash("HEX");

    return hash;
  } catch (error) {
    throw new Error("Error generating payment hash");
  }
};


