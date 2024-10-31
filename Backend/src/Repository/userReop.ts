import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel";
import { Dishes } from "../models/dishesModel";
import { Auditorium } from "../models/auditoriumModel";
import { bookedModel } from "../models/bookedEvent";
import { chatModel } from "../models/chatModel";
import { User } from '../interfaces/user';
import { VendorModel } from "../models/vendorModel";
import { IUserRepository } from "../interfaces/repository/userRepository";
import { messageModel } from "../models/messageModal";
import { Reviews } from "../models/reviews";
import { NotificationModel } from "../models/notificationModel";
import { ISlot } from "../interfaces/slot";
import { Slot } from '../models/slotModel';
import { BaseRepository } from "../Base Repository/BaseRepo";
import AdminModel from "../models/adminModel";



export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super(UserModel, VendorModel, AdminModel, chatModel);
  }

  async getAllVendors() {
    return await this.getAll();
  }



  async createUser(user: User): Promise<any> {
    try {
      return await this.create(user)
    } catch (error) {
      throw new Error('Database Error');
    }
  }

  async findUserByEmail(email: string) {
    try {
console.log('ziyavudeheen');

      const user = await this.userByEmail(email);
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Database Error');
    }
  }

  async verifyAndSaveUserRepo(email: string, otp: string) {
    try {
      const user = await UserModel.findOne({ email, isBlocked: false }).exec();
      if (user && user.otp === otp) {
        user.otp = undefined;
        user.otpVerified = true;
        await user.save();
        return user;
      }
      throw new Error("Invalid OTP");
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Database Error');
    }
  }

  async findUserById(userId: string) {
    try {
      return await this.userById(userId)
    } catch (error) {
      throw new Error('Database Error');

    }
  }

  async userEditFromDB(userDetails: User): Promise<User> {
    try {
      const existingUser = await UserModel.findOne({ email: userDetails.email });
      if (existingUser) {
        existingUser.username = userDetails.username;
        existingUser.phone = userDetails.phone;
        existingUser.profileImage = userDetails.profileImage;
        existingUser.address = userDetails.address;
        existingUser.state = userDetails.state;
        existingUser.district = userDetails.district;
        existingUser.pincode = userDetails.pincode;
        existingUser.reviews = userDetails.reviews;
        await existingUser.save();
        return existingUser;
      } else {
        const newUser = new UserModel(userDetails);
        await newUser.save();
        return newUser;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Database operation failed');
    }
  }


  async updateUser(email: string, update: Partial<User>) {
    try {
      return this.updateUserBase(email, update)
    } catch (error) {
      throw new Error('Database Error');
    }
  }

  async findUserByEmailupdate(email: string, password: string) {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }
      console.log(user.email);
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      return user;
    } catch (error) {
      throw new Error('Database Error');

    }
  }

  async fetchfromDBDishes(vendorId: string): Promise<any | null> {
    try {
      const objectId = new mongoose.Types.ObjectId(vendorId);
      const result = await Auditorium.find(objectId);
      return result;
    } catch (error) {
      console.error('Error fetching Dishes from the database:', error);
      throw new Error('Error fetching Dishes from the database');
    }

  }


  // async updateUser(email: string, update: Partial<User>) {
  //   try {
  //     return this.updateUserBase
  //   } catch (error) {
  //     throw new Error('Database Error');
  //   }
  // }


  async fetchfromDBAuditorium(vendorId: string): Promise<any | null> {
    try {
      return this.fetchAuditorium(vendorId)
    } catch (error) {
      console.error('Error fetching auditorium from the database:', error);
      throw new Error('Error fetching auditorium from the database');
    }
  }



  async findVendor(vendorId: string) {
    try {
      return this.findVendorBase(vendorId)
    } catch (error) {
      console.error("Error in repository:", error);
      throw error;
    }
  }


  async findVendorByIdInDb(vendorId: string, userId: string) {
    try {
      console.log('1234323');

      let chat = await chatModel.findOne({ userId, vendorId });
      if (!chat) {
        chat = new chatModel({
          userId,
          vendorId,
        });
        await chat.save();
      }
      return { chatId: chat._id };
    } catch (error) {
      console.error("Error in repository:", error);
      throw error;
    }
  }

  async findReviewByIdInDb(vendorId: string, userId: string) {
    try {
      const review = await Reviews.find({
        userId,
        vendorId,
        vendorVerified: true
      }).populate('userId')

      console.log(review);

      if (!review) {
        return { message: 'No review found' };
      }

      return { review }
    } catch (error) {
      throw new Error('Database Error');
    }
  }

  async findNotificationsByIdInDb(userId: any) {
    try {
      const notifications = await NotificationModel.find()
      // .populate('vendorId')
      // .populate('userId')
      return { notification: notifications };
    } catch (error) {
      throw new Error('Database Error');

    }
  }





  async findFoodVendorIdInDb(vendorId: string) {
    try {


      const objectId = new mongoose.Types.ObjectId(vendorId);
      const result = await Dishes.find({ vendorId: objectId, isDeleted: false });

      return result;
    } catch (error) {
      console.error('Error fetching dishes:', error);
      throw new Error(`Error fetching dishes: ${error}`);
    }
  }

  async findAuditoriumVendorIdInDb(vendorId: string) {
    try {
      const objectId = new mongoose.Types.ObjectId(vendorId);

      const result = await Auditorium.find({ vendorId: objectId, isDeleted: false });
      return result
    } catch (error) {
      throw new Error(`Error fetching dishes: ${error}`);
    }
  }


  async findAuditoriumByIdInDb(auditoriumId: string) {

    try {
      let result = await Auditorium.findById(auditoriumId);
      return result
    } catch (error) {
      throw new Error('Database Error');

    }
  }

  async finddishesByIdInDb(dishesId: string) {
    console.log('thenkasi');
    
    try {
      console.log('Entering Repository Layer');
      const result = await this.dishesById(dishesId);
      return result;
    } catch (error) {
      throw new Error(`Repository Error - Fetching by ID: ${error}`);
    }
  }
  

  async getBookingDetail(id: string) {
    try {

      const bookedData = await bookedModel
        .findById(id)
      return bookedData;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw new Error('Database Error');
    }
  }





  async updateBookingStatus(bookingData: any) {
    try {
      const { txnid, status, StartingDate, EndingDate, vendorId } = bookingData;
      const bookings = await bookedModel.find({ txnId: txnid });
      console.log(bookings, 'liston');

      if (bookings.length > 1) {
        const [firstBooking, ...duplicateBookings] = bookings;
        await bookedModel.deleteMany({ _id: { $in: duplicateBookings.map(b => b._id) } });
        console.log(`Deleted ${duplicateBookings.length} duplicate bookings for txnid: ${txnid}`);

        firstBooking.paymentStatus = 'success';
        await firstBooking.save();
        console.log('Booking updated successfully:', firstBooking);

        await this.updateSlotAvailability(firstBooking.StartingDate, firstBooking.EndingDate, vendorId);
        return firstBooking;
      } else if (bookings.length === 1) {
        const booking = bookings[0];
        booking.paymentStatus = 'success';
        await booking.save();
        console.log('Booking updated successfully:', booking);

        await this.updateSlotAvailability(booking.StartingDate, booking.EndingDate, vendorId);
        return booking;
      } else {
        const newBooking = await bookedModel.create({
          txnId: txnid,
          paymentStatus: status,
          ...bookingData,
          createdAt: new Date(),
        });
        console.log('New booking created:', newBooking);

        await this.updateSlotAvailability(newBooking.StartingDate, newBooking.EndingDate, vendorId);
        return newBooking;
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error('Database Error');
    }
  }



  async updateSlotAvailability(startingDate: Date, endingDate: Date, vendorId: string) {
    try {
      const startTimestamp = startingDate.getTime();
      const endTimestamp = endingDate.getTime();

      const availableSlots = await Slot.find({
        vendorId: vendorId,
        date: {
          $gte: new Date(Math.min(startTimestamp, endTimestamp)),
          $lte: new Date(Math.max(startTimestamp, endTimestamp))
        },
        isAvailable: true,
      });

      if (availableSlots.length > 0) {
        await Slot.updateMany(
          {
            _id: { $in: availableSlots.map(slot => slot._id) },
          },
          { isAvailable: false }
        );
        console.log(`Updated ${availableSlots.length} slots to unavailable.`);
      } else {
        console.log('No available slots found for the given dates.');
      }
    } catch (error) {
      throw new Error('Database Error');
    }
  }








  async savechatDB(chat: string) {
    try {
      const newChat = new chatModel({ message: chat });
      console.log('save karo--------------------------');

      return await newChat.save();
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Database operation failed.");
    }
  }


  async findDetailsByUserId(userId: string) {
    try {
      const results = await bookedModel
        .find({ userId: userId, paymentStatus: "success" })
        .populate('dishesId')
        .populate('userId')
        .populate('vendorId')
        .populate('auditoriumId');
      return results;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Database operation failed.");
    }
  }


  async changepassword(userId: string, newPassword: string) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async chatDB(userId: string) {
    try {
      const chats = await chatModel.find({ userId }).select('_id');
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
        senderModel: "Vendor",
        isRead: false,
      });

      return unreadCount;
    } catch (error) {
      console.error("Error fetching unread messages count from the database:", error);
      throw error;
    }
  }




  async reviewRepository(reviewData: { reviews: string; stars: number; userId: string; vendorId: string }): Promise<any> {
    try {
      console.log('reviewRepository');

      const review = new Reviews(reviewData);

      const savedReview = await review.save();
      console.log("Review saved:", savedReview);

      return savedReview;
    } catch (error) {
      console.error("Error saving review to the database:", error);
      throw error;
    }
  }

  async getReviewsByVendorId(vendorId: string): Promise<any[]> {
    console.log('getReviewsByVendorId');

    try {
      const reviews = await Reviews.find({
        vendorId: vendorId,
        vendorVerified: true
      });

      console.log(reviews);
      return reviews;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  }




  async updateVendorRating(vendorId: string, averageRating: number): Promise<any | null> {
    console.log('updateVendorRating');

    try {
      const updatedVendor = await VendorModel.findByIdAndUpdate(
        vendorId,
        { rating: averageRating },
        { new: true }
      );
      return updatedVendor;
    } catch (error) {
      console.error("Error updating vendor rating:", error);
      throw error;
    }
  }

  async getSlotsByWorkerIdFromRepo(vendorId: string): Promise<ISlot[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return await Slot.find({
        vendorId,
        isAvailable: true,
        date: { $gte: today },
      }).exec();
    } catch (error) {
      throw error;

    }
  }



  async saveBooking(bookingData: any): Promise<any> {
    try {
      console.log('sanooj');
      const newBooking = new bookedModel({
        vendorId: bookingData.productinfo,
        userId: bookingData.udf1,
        totalAmount: bookingData.amount,
        paymentType: "online",
        paymentStatus: bookingData.paymentStatus,
        txnId: bookingData.txnid || null,
        StartingDate: bookingData.udf4,
        EndingDate: bookingData.udf7,
        eventType: bookingData.udf6,
        category: bookingData.udf5,
        occupancy: bookingData.occupancy,
        // Check for "nil" or any invalid ObjectId string
        dishesId: bookingData.udf3 !== "nil" ? bookingData.udf3 : null,
        auditoriumId: bookingData.udf2 !== "nil" ? bookingData.udf2 : null,
      });
  
      const savedBooking = await newBooking.save();
      return savedBooking;
    } catch (error) {
      console.error('Error saving booking:', error);
      throw new Error('Error saving booking');
    }
  }
  


  async searchVendorsByName(term: string) {
    try {
      return await VendorModel.find({
        vendorname: { $regex: term, $options: 'i' },
        isBlocked: false,
      }).exec();
    } catch (error) {
      throw new Error(`Error fetching vendors: ${error}`);
    }
  }




}

















