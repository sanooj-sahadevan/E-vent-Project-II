import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import jsSHA from "jssha";

import { otpGenerator } from "../utils/otpGenerator";
import { sendEmail } from "../utils/sendEmail";
import { IUserRepository } from "../interfaces/repository/userRepository";
import { io } from "..";

export class UserService  {

  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async registerUser(user: any) {
    try {
      const existingUser = await this.userRepository.findUserByEmail(user.email);
      if (existingUser) {
        if (existingUser.otpVerified) {
          throw new Error("User already exists and is verified.");
        } 
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      return await this.userRepository.createUser(user);
    } catch (error) {
      console.error("Error during user registration:", error);
      throw new Error(`Registration error: ${(error as Error).message}`);
    }
  }



  async loginUser(email: string, password: string) {
    try {
      const user = await this.userRepository.findUserByEmail(email);

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
    } catch (error: any) {
      throw new Error(error.message)
    }
  }



  async checkEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }
    const otp = otpGenerator();
    await sendEmail(email, otp);
    return { user, otp };
  }



  async verifyOtpService(email: string, otp: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.otp === otp) {
      await this.userRepository.verifyAndSaveUserRepo(email, otp);
      return "User registered successfully";
    } else {
      throw new Error("Invalid OTP");
    }
  }


  async update(email: string, password: string) {
    try {
      console.log('Service: Calling repository to update password');
      const user = await this.userRepository.findUserByEmailupdate(email, password);
      return user;
    } catch (error) {
      console.error(error);
    }
  }



  async getAllVendors(): Promise<any[]> {
    try {
      return await this.userRepository.getAllVendors();
    } catch (error) {
      throw new Error('Error fetching vendors');
    }
  }



  async getAllDishes(vendorId: string): Promise<any[]> {
    try {
      const result = await this.userRepository.fetchfromDBDishes(vendorId);
      return result;
    } catch (error) {
      throw new Error('Error fetching dishes');
    }
  }

  async getAllAuditorium(vendorId: string): Promise<any[]> {
    try {
      console.log('Service: Fetching auditoriums for vendor:', vendorId);
      const result = await this.userRepository.fetchfromDBAuditorium(vendorId);
      return result;
    } catch (error) {
      throw new Error('Error fetching auditoriums');
    }
  }


  async editUser(userDetails: any) {
    try {
      return await this.userRepository.userEditFromDB(userDetails);
    } catch (error) {
      throw new Error('Failed to update user details');
    }
  }



  async findVendorById(vendorId: string, userId: string) {
    try {
      const vendor = await this.userRepository.findVendor(vendorId); // Fetch the vendor details
      const chat = await this.userRepository.findVendorByIdInDb(vendorId, userId); // Fetch or create chat details
      return { vendor, chatId: chat.chatId }; // Return both vendor and chat ID
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  }

  async findFoodVendorById(vendorId: string) {
    try {
      console.log('Service invoked to find dishes for vendor:', vendorId);
      const dishes = await this.userRepository.findFoodVendorIdInDb(vendorId);
      if (!dishes || dishes.length === 0) {
        throw new Error(`Error finding vendor dishes`);
      } else {
        return dishes;

      }
    } catch (error) {
      throw new Error(`Error finding vendor dishes: ${error}`);
    }
  }

  async findAuditoriumVendorById(vendorId: string) {
    try {
      console.log('Service invoked to find dishes for vendor:', vendorId);
      const dishes = await this.userRepository.findAuditoriumVendorIdInDb(vendorId);
      if (!dishes || dishes.length === 0) {
        throw new Error(`Error finding vendor dishes`);
      } else {
        return dishes;
      }

    } catch (error) {
      throw new Error(`Error finding vendor dishes: ${error}`);
    }
  }


  async findAuditoriumById(auditoriumId: string) {
    try {
      const vendor = await this.userRepository.findAuditoriumByIdInDb(auditoriumId);
      if (!vendor) {
        throw new Error(`Error finding vendor dishes`);
      } else {
        return vendor;
      }
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  }



  async finddishesById(dishesId: string) {
    try {
      const vendor = await this.userRepository.finddishesByIdInDb(dishesId);
      if (!vendor) {
        throw new Error(`Error finding vendor`);
      }
      return vendor
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  }


  async findEvent(bookingId: string) {
    try {

      const bookingDetails = await this.userRepository.getBookingDetail(bookingId);
      if (!bookingDetails) {
        throw new Error(`Booking with id not found`);
      }
      return bookingDetails;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  }


  async addTransactionDetails(
    email: string,
    PayUOrderId: string,
    status: "success" | "failed"
  ) {
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

  async fetchbookingData(bookingData: any) {
    const bookedTrip = await this.userRepository.createBookedTrip(bookingData);
    console.log(bookedTrip,'okokookok');
    return bookedTrip;
  }



  async findBookingDetails(userId: string) {
    const bookingDetails = await this.userRepository.findDetailsByUserId(userId);
    if (!bookingDetails) {
      throw new Error(`Booking with id not found`);
    }
    return bookingDetails;
  }


  async findchangePassword(userId: string, newPassword: string) {
    console.log('Updating password for userId:', userId);
    const updatedPassword = await this.userRepository.changepassword(userId, newPassword);
    if (!updatedPassword) throw new Error(`Booking with id not found`);
    return updatedPassword;
  }


  async findUserByEmailService(email: string) {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      console.log('otp service');

      return { user, email };
    } catch (error) {
      console.error(error);
    }
  }

  async generatePaymentHash({
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
  }) {
    try {
      const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${username}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|||||${process.env.PAYU_SALT}`;

      const sha = new jsSHA("SHA-512", "TEXT");
      sha.update(hashString);
      const hash = sha.getHash("HEX");

      return hash;
    } catch (error) {
      throw new Error("Error generating payment hash");
    }
  }

  async chatServices  ({ userId }: { userId: string })  {
    try {
      const chats = await this.userRepository.chatDB(userId);
      console.log(chats,'ok serive');
      
      return chats;
    } catch (error) {
      console.error("Error fetching chats:", error);
      throw error;
    }
  }
  async messageService  ({
    chatIds,
    userId,
  }: {
    chatIds: string[];
    userId: string;
  })  {
    try {
      const unreadCount = await this.userRepository.messageDB(chatIds);
  
      io.to(userId).emit("unreadCount", { unreadCount });
  console.log(unreadCount,'ok messge service');
  console.log('emmited sucessfullly');
  
      return unreadCount;
    } catch (error) {
      console.error("Error fetching unread messages:", error);
      throw error;
    }
  }  

}




























/*
export default {
 registerUser : async (user: any) => {
    try {
      const existingUser = await userRepositary.findUserByEmail(user.email);
      if (existingUser) {
        if (existingUser.otpVerified) {
          throw new Error("User already exists and is verified.");
        } else {
          await userRepositary.updateUser(existingUser.email, { otp: user.otp, ...user });
          return existingUser;
        }
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      return await userRepositary.createUser(user);
    } catch (error) {
      console.error("Error during user registration:", error);
      throw new Error(`Registration error: ${(error as Error).message}`);
    }
  },




   loginUser : async (email: string, password: string) => {
    const user = await userRepositary.findUserByEmail(email);

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
  },

















  checkEmail : async (email: string) => {
    const user = await userRepositary.findUserByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }
    const otp = otpGenerator();
    await sendEmail(email, otp);
    return { user, otp };
  },



   verifyOtpService : async (email: string, otp: string) => {
    const user = await userRepositary.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.otp === otp) {
      await userRepositary.verifyAndSaveUserRepo(email, otp);
      return "User registered successfully";
    } else {
      throw new Error("Invalid OTP");
    }
  },


  update : async (email: string, password: string) => {
    try {
      console.log('Service: Calling repository to update password');
      const user = await userRepositary.findUserByEmailupdate(email, password);
      return user;
    } catch (error) {
      console.error(error);
    }
  },



  getAllVendors : async (): Promise<any[]> => {
    try {
      return await userRepositary.getAllVendors();
    } catch (error) {
      throw new Error('Error fetching vendors');
    }
  },



 getAllDishes : async (vendorId: string): Promise<any[]> => {
    try {
      const result = await userRepositary.fetchfromDBDishes(vendorId);
      return result;
    } catch (error) {
      throw new Error('Error fetching dishes');
    }
  },

  getAllAuditorium : async (vendorId: string): Promise<any[]> => {
    try {
      console.log('Service: Fetching auditoriums for vendor:', vendorId);
      const result = await userRepositary.fetchfromDBAuditorium(vendorId);
      return result;
    } catch (error) {
      throw new Error('Error fetching auditoriums');
    }
  },


editUser : async (userDetails: any) => {
    try {
      return await userRepositary.userEditFromDB(userDetails);
    } catch (error) {
      throw new Error('Failed to update user details');
    }
  },



findVendorById : async (vendorId: string, userId: string) => {
    try {
      const vendor = await userRepositary.findVendor(vendorId); // Fetch the vendor details
      const chat = await userRepositary.findVendorByIdInDb(vendorId, userId); // Fetch or create chat details
      return { vendor, chatId: chat.chatId }; // Return both vendor and chat ID
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  },

findFoodVendorById : async (vendorId: string) => {
    try {
      console.log('Service invoked to find dishes for vendor:', vendorId);
      const dishes = await userRepositary.findFoodVendorIdInDb(vendorId);
      if (!dishes || dishes.length === 0) {
        throw new Error(`Error finding vendor dishes`);
      } else {
        return dishes;

      }
    } catch (error) {
      throw new Error(`Error finding vendor dishes: ${error}`);
    }
  },

findAuditoriumVendorById : async (vendorId: string) => {
    try {
      console.log('Service invoked to find dishes for vendor:', vendorId);
      const dishes = await userRepositary.findAuditoriumVendorIdInDb(vendorId);
      if (!dishes || dishes.length === 0) {
        throw new Error(`Error finding vendor dishes`);
      } else {
        return dishes;
      }

    } catch (error) {
      throw new Error(`Error finding vendor dishes: ${error}`);
    }
  },


  findAuditoriumById : async (auditoriumId: string) => {
    try {
      const vendor = await userRepositary.findAuditoriumByIdInDb(auditoriumId);
      if (!vendor) {
        throw new Error(`Error finding vendor dishes`);
      } else {
        return vendor;
      }
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  },



  finddishesById : async (dishesId: string) => {
    try {
      const vendor = await userRepositary.finddishesByIdInDb(dishesId);
      if (!vendor) {
        throw new Error(`Error finding vendor`);
      }
      return vendor
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  },


   findEvent : async (bookingId: string) => {
    try {

      const bookingDetails = await userRepositary.getBookingDetail(bookingId);
      if (!bookingDetails) {
        throw new Error(`Booking with id not found`);
      }
      return bookingDetails;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  },


  addTransactionDetails : async (
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
  },

   fetchbookingData : async (bookingData: any) => {
    const bookedTrip = await userRepositary.createBookedTrip(bookingData);
    console.log(bookedTrip);
    return bookedTrip;
  },



  findBookingDetails :async (userId: string) => {
    const bookingDetails = await userRepositary.findDetailsByUserId(userId);
    if (!bookingDetails) {
      throw new Error(`Booking with id not found`);
    }
    return bookingDetails;
  },


  findchangePassword :async (userId: string, newPassword: string) => {
    console.log('Updating password for userId:', userId);
    const updatedPassword = await userRepositary.changepassword(userId, newPassword);
    if(!updatedPassword)   throw new Error(`Booking with id not found`);
    return updatedPassword;
  },


 findUserByEmailService : async (email: string) => {
    try {
      const user = await userRepositary.findUserByEmail(email);
      console.log('otp service');

      return { user, email };
    } catch (error) {
      console.error(error);
    }
  },

  generatePaymentHash : async ({
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

      const sha = new jsSHA("SHA-512", "TEXT");
      sha.update(hashString);
      const hash = sha.getHash("HEX");

      return hash;
    } catch (error) {
      throw new Error("Error generating payment hash");
    }
  }

}
*/

// export const registerUser = async (user: any) => {
//   try {
//     const existingUser = await userRepositary.findUserByEmail(user.email);
//     if (existingUser) {
//       if (existingUser.otpVerified) {
//         throw new Error("User already exists and is verified.");
//       } else {
//         console.log('Updating existing user with new OTP:', user.otp);
//         await userRepositary.updateUser(existingUser.email, { otp: user.otp, ...user });
//         return existingUser;
//       }
//     }
//     const hashedPassword = await bcrypt.hash(user.password, 10);
//     user.password = hashedPassword;
//     return await userRepositary.createUser(user);
//   } catch (error) {
//     console.error("Error during user registration:", error);
//     throw new Error(`Registration error: ${(error as Error).message}`);
//   }
// };





// export const loginUser = async (email: string, password: string) => {
//   const user = await userRepositary.findUserByEmail(email);

//   if (!user) {
//     throw new Error("Invalid Email/Password");
//   }
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     throw new Error("Invalid Email/Password");
//   }
//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
//     expiresIn: "1h",
//   });
//   return { user, token };
// };

// export const checkEmail = async (email: string) => {
//   const user = await userRepositary.findUserByEmail(email);

//   if (!user) {
//     throw new Error('User not found');
//   }
//   const otp = otpGenerator();
//   await sendEmail(email, otp);
//   return { user, otp };
// };



// export const verifyOtpService = async (email: string, otp: string) => {
//   const user = await userRepositary.findUserByEmail(email);
//   if (!user) {
//     throw new Error("User not found");
//   }

//   if (user.otp === otp) {
//     await userRepositary.verifyAndSaveUserRepo(email, otp);
//     return "User registered successfully";
//   } else {
//     throw new Error("Invalid OTP");
//   }
// };


// export const update = async (email: string, password: string) => {
//   try {
//     console.log('Service: Calling repository to update password');
//     const user = await userRepositary.findUserByEmailupdate(email, password);
//     return user;
//   } catch (error) {
//     console.error(error);
//   }
// };


// const vendorRepository = new VendorRepository();

// export const getAllVendors = async (): Promise<any[]> => {
//   try {
//     return await vendorRepository.getAllVendors();
//   } catch (error) {
//     throw new Error('Error fetching vendors');
//   }
// };



// export const getAllDishes = async (vendorId: string): Promise<any[]> => {
//   try {
//     const result = await userRepositary.fetchfromDBDishes(vendorId);
//     return result;
//   } catch (error) {
//     throw new Error('Error fetching dishes');
//   }
// };

// export const getAllAuditorium = async (vendorId: string): Promise<any[]> => {
//   try {
//     console.log('Service: Fetching auditoriums for vendor:', vendorId);
//     const result = await userRepositary.fetchfromDBAuditorium(vendorId);
//     return result;
//   } catch (error) {
//     throw new Error('Error fetching auditoriums');
//   }
// };


// export const editUser = async (userDetails: any) => {
//   try {
//     return await userRepositary.userEditFromDB(userDetails);
//   } catch (error) {
//     throw new Error('Failed to update user details');
//   }
// };



// export const findVendorById = async (vendorId: string, userId: string) => {
//   try {
//     const vendor = await userRepositary.findVendor(vendorId); // Fetch the vendor details
//     const chat = await userRepositary.findVendorByIdInDb(vendorId, userId); // Fetch or create chat details
//     return { vendor, chatId: chat.chatId }; // Return both vendor and chat ID
//   } catch (error) {
//     throw new Error(`Error finding vendor: ${error}`);
//   }
// };


// export const findFoodVendorById = async (vendorId: string) => {
//   try {
//     console.log('Service invoked to find dishes for vendor:', vendorId);
//     const dishes = await userRepositary.findFoodVendorIdInDb(vendorId);
//     if (!dishes || dishes.length === 0) {
//       throw new Error(`Error finding vendor dishes`);
//     } else {
//       return dishes;

//     }
//   } catch (error) {
//     throw new Error(`Error finding vendor dishes: ${error}`);
//   }
// };

// export const findAuditoriumVendorById = async (vendorId: string) => {
//   try {
//     console.log('Service invoked to find dishes for vendor:', vendorId);
//     const dishes = await userRepositary.findAuditoriumVendorIdInDb(vendorId);
//     if (!dishes || dishes.length === 0) {
//       throw new Error(`Error finding vendor dishes`);
//     } else {
//       return dishes;
//     }

//   } catch (error) {
//     throw new Error(`Error finding vendor dishes: ${error}`);
//   }
// };


// export const findAuditoriumById = async (auditoriumId: string) => {
//   try {
//     const vendor = await userRepositary.findAuditoriumByIdInDb(auditoriumId);
//     if (!vendor) {
//       throw new Error(`Error finding vendor dishes`);
//     } else {
//       return vendor;
//     }
//   } catch (error) {
//     throw new Error(`Error finding vendor: ${error}`);
//   }
// };



// export const finddishesById = async (dishesId: string) => {
//   try {
//     const vendor = await userRepositary.finddishesByIdInDb(dishesId);
//     if (!vendor) {
//       throw new Error(`Error finding vendor`);
//     }
//     return vendor
//   } catch (error) {
//     throw new Error(`Error finding vendor: ${error}`);
//   }
// };






// export const findEvent = async (bookingId: string) => {
//   try {

//     const bookingDetails = await userRepositary.getBookingDetail(bookingId);
//     if (!bookingDetails) {
//       throw new Error(`Booking with id not found`);
//     }
//     return bookingDetails;
//   } catch (error) {
//     console.error("Error fetching booking details:", error);
//     throw error;
//   }
// };


// export const addTransactionDetails = async (
//   email: string,
//   PayUOrderId: string,
//   status: "success" | "failed"
// ) => {
//   try {
//     // const PayUOrderData = await PayURepository.getPayUOrder(PayUOrderId);
//     // if (!PayUOrderData) throw new Error("PayU Order Data not found");
//     // console.log("Got order id");
//     // console.log(PayUOrderData);

//     // const userData = await userServices.getUserDataByEmail(email);
//     // if (!userData) throw new Error("User Data not found.");
//     // const userId = userData._id.toString();

//     // const transaction = await adsRepository.addTransaction(
//     //   userId,
//     //   PayUOrderId,
//     //   PayUOrderData.mihpayid,
//     //   status,
//     //   PayUOrderData.amount
//     // );
//     // console.log("Added transaction");
//     // console.log(transaction);
//     // if (!transaction) throw new Error("Transaction Data not found");

//     // if (status === "success") {
//     //   const postId = PayUOrderData?.productinfo;
//     //   const WeNetAdsData = await adsRepository.createWenetAds(
//     //     userId,
//     //     postId,
//     //     transaction._id.toString()
//     //   );
//     //   console.log("created WeNetAdsData");
//     //   console.log(WeNetAdsData);

//     //   const postData = await adsRepository.addAdDataToPost(postId);
//     //   console.log("Added ad data to post ");
//     //   console.log(postData);

//     //   try {
//     //     await adsRepository.sendPostAdDataToMQ(
//     //       postData._id.toString(),
//     //       postData.WeNetAds
//     //     );
//     //   } catch (error: any) {
//     //     console.log(error.message);
//     //   }
//     // }
//     // return transaction._id.toString();
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// }

// export const fetchbookingData = async (bookingData: any) => {
//   const bookedTrip = await userRepositary.createBookedTrip(bookingData);
//   console.log(bookedTrip);
//   return bookedTrip;
// };



// export const findBookingDetails = async (userId: string) => {
//   const bookingDetails = await userRepositary.findDetailsByUserId(userId);
//   if (!bookingDetails) {
//     throw new Error(`Booking with id not found`);
//   }
//   return bookingDetails;
// };


// export const findchangePassword = async (userId: string, newPassword: string) => {
//   console.log('Updating password for userId:', userId);
//   const updatedPassword = await userRepositary.changepassword(userId, newPassword);
//   return updatedPassword;
// };


// export const findUserByEmailService = async (email: string) => {
//   try {
//     const user = await userRepositary.findUserByEmail(email);
//     console.log('otp service');

//     return { user, email };
//   } catch (error) {
//     console.error(error);
//   }
// };




// export const generateOtp = () => {
//   const otp = otpGenerator();
//   console.log(otp, "OTP-------------------");
//   return otp;
// };



// export const generatesendEmail = async (email: string, otp: any) => {
//   try {
//     const result = sendEmail(email, otp);
//     console.log(result);

//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     throw new Error("Failed to send OTP.");
//   }
// };


// export const generatePaymentHash = async ({
//   txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6
// }: {
//   txnid: string,
//   amount: string,
//   productinfo: string,
//   username: string,
//   email: string,
//   udf1: string,
//   udf2: string,
//   udf3: string,
//   udf4: string,
//   udf5: string,
//   udf6: string
// }) => {
//   try {
//     const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${username}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|||||${process.env.PAYU_SALT}`;

//     const sha = new jsSHA("SHA-512", "TEXT");
//     sha.update(hashString);
//     const hash = sha.getHash("HEX");

//     return hash;
//   } catch (error) {
//     throw new Error("Error generating payment hash");
//   }
// };




