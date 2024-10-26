import mongoose, { Document, Model } from "mongoose";
import { DishDocument, Dishes } from '../models/dishesModel';
import { Auditorium } from "../models/auditoriumModel";
import { bookedModel } from "../models/bookedEvent";
import { chatModel } from "../models/chatModel";
import { messageModel } from "../models/messageModal";
import { VendorModel } from "../models/vendorModel";
import { Vendor } from '../interfaces/vendor'
import { IVendorRepository } from "../interfaces/repository/vendorRepository";
import { Reviews } from "../models/reviews";
import { Slot } from "../models/slotModel";
import { ISlot } from "../interfaces/slot";
import UserModel from "../models/userModel";
import { NotificationModel } from "../models/notificationModel";



export class VendorRepository implements IVendorRepository {
  constructor() {
  }

  async createVendor(vendor: Vendor): Promise<any> {
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
      throw new Error('Database query failed');

    }
  }

  async findVendorByEmailAndPassword(email: string, password: string) {
    try {
      return VendorModel.findOne({ email, password });
    } catch (error) {
      throw new Error('Database query failed');

    }
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


  async editVendorRepo(
    existingVendor: Vendor | null,
    vendorDetails: Vendor,
  ): Promise<Vendor> {
    try {
      if (existingVendor) {
        existingVendor.vendorname = vendorDetails.vendorname;
        existingVendor.phone = vendorDetails.phone;
        existingVendor.address = vendorDetails.address;
        existingVendor.district = vendorDetails.district;
        existingVendor.state = vendorDetails.state;
        existingVendor.description = vendorDetails.description;
        existingVendor.profileImage = vendorDetails.profileImage || existingVendor.profileImage;
        await existingVendor.save();
        return existingVendor;
      } else {
        const newVendor = new VendorModel({
          ...vendorDetails,
          profileImage: vendorDetails.profileImage,
        });

        await newVendor.save();
        return newVendor;
      }
    } catch (error) {
      console.error('Error in editVendorRepo:', error);
      throw new Error('Database operation failed');
    }
  }





  async findVendorByIdInDb(vendorId: string) {
    try {
      return await VendorModel.findById(vendorId);

    } catch (error) {
      throw new Error('Database operation failed');

    }
  }

  async findAuditoriumByIdInDb(auditoriumId: string) {

    try {
      let result = await Auditorium.findById(auditoriumId);
      return result
    } catch (error) {
      throw new Error('Database operation failed');

    }


  }

  async findDishesByIdInDb(dishesId: string) {
    try {
      return await Dishes.findById(dishesId);
    } catch (error) {
      throw new Error('Database operation failed');
    }
  }

  async findFoodVendorIdInDb(vendorId: string) {
    try {
      const result = await Dishes
        .find({ vendorId: vendorId })

      return result
    } catch (error) {
      throw new Error('Database operation failed');

    }
  }
  async findReviewsVendorIdInDb(vendorId: string) {
    try {
      const result = await Reviews
        .find({ vendorId: vendorId, })
        .populate('userId')
        .exec();
      return result
    } catch (error) {
      throw new Error('Database operation failed');

    }
  }




  async findAuditoriumVendorIdInDb(vendorId: string) {
    try {
      const res = await Auditorium.find({ vendorId: vendorId });
      return res
    } catch (error) {
      throw new Error('Database operation failed');

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
      await savedDish.populate("vendorId");

      console.log("Saved Dish: ", savedDish);

      return savedDish;
    } catch (error) {
      console.error("Error saving dish: ", error);
      throw new Error('Database operation failed');
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
        images: auditoriumData.images,
        capacity: auditoriumData.data.capacity,
      });

      const savedAuditorium = await auditorium.save();
      await savedAuditorium.populate("vendorId");
      return savedAuditorium

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
      throw new Error('Database operation failed');
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
      throw new Error('Database operation failed');
    }
  }


  async updatedreviewRepo(reviewId: string) {
    try {
      const review = await Reviews.findById(reviewId);
      console.log(review);
      if (!review || review.vendorVerified) {
        return null;
      }
      review.vendorVerified = true;
      await review.save();
      console.log(review);

      return review;
    } catch (error) {
      console.error(`Error soft-deleting auditorium: ${error}`);
      throw new Error('Database operation failed');
    }
  }
  async updatedreviewRepoReject(reviewId: string) {
    try {
      const review = await Reviews.findById(reviewId);
      if (!review) {
        console.log('Review not found');
        return null;
      }

      await Reviews.findByIdAndDelete(reviewId);
      console.log(`Review with ID ${reviewId} deleted successfully.`);

      return review;
    } catch (error) {
      console.error(`Error deleting review: ${error}`);
      throw new Error('Database operation failed');
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
      throw new Error('Database operation failed');
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
      throw new Error('Database operation failed');
    }
  }

  async findSlotByWorkerAndDate(vendorId: mongoose.Types.ObjectId, date: Date): Promise<any | null> {

    try {
      return Slot.findOne({ vendorId, date }).exec();
    } catch (error) {
      throw new Error('Database operation failed');

    }
  }

  async createSlot(slotData: { vendorId: mongoose.Types.ObjectId; date: Date; startDate?: Date; endDate?: Date }): Promise<ISlot> {

    try {
      const slot = new Slot(slotData);
      return await slot.save();
    } catch (error) {
      throw new Error('Database operation failed');

    }

  }


  async getSlotsByWorkerIdFromRepo(vendorId: mongoose.Types.ObjectId): Promise<ISlot[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return Slot.find({
        vendorId,
        date: { $gte: today },
      }).exec();
    } catch (error) {
      throw new Error('Database operation failed');

    }
  }

  async notifyDishAdded(vendorId: string, dishId: mongoose.Types.ObjectId, dishName: string): Promise<void> {
    try {
      const message = `New dish "${dishName}" has been added by Vendor ${vendorId}.`;
      const users = await this.getAllUsers();
      const notificationPromises = users.map(user =>
        this.createNotificationDishes({
          userId: user._id,
          vendorId: vendorId,
          dishId: dishId,
          notificationMessage: message,
          type: "dish_added"
        })
      );

      await Promise.all(notificationPromises);

      console.log(`Notifications sent for dish: ${dishName}`);
    } catch (error) {
      console.error("Error in notifyDishAdded: ", error);
      throw new Error('Database operation failed');
    }
  }




  async notifyAuditoriumAdded(vendorId: string, auditoriumId: mongoose.Types.ObjectId, auditoriumName: string): Promise<void> {
    try {
      const message = `New Auditorium "${auditoriumName}" has been added by Vendor ${vendorId}.`;
      const users = await this.getAllUsers();
      const notificationPromises = users.map(user =>
        this.createNotificationAudi({
          userId: user._id,
          vendorId: vendorId,
          auditoriumId: auditoriumId,
          notificationMessage: message,
          type: "dish_added"
        })
      );

      await Promise.all(notificationPromises)

      console.log(`Notifications sent for auditoriumName: ${auditoriumName}`);
    } catch (error) {
      console.error("Error in notifyDishAdded: ", error);
      throw new Error('Database operation failed');
    }
  }

  async createNotificationAudi(notificationData: { userId: any; vendorId: string; auditoriumId: mongoose.Types.ObjectId; notificationMessage: string; type: string }) {
    try {
      return await NotificationModel.create(notificationData);
    } catch (error) {
      throw new Error('Database operation failed');
    }
  }
  async createNotificationDishes(notificationData: { userId: any; vendorId: string; dishId: mongoose.Types.ObjectId; notificationMessage: string; type: string }) {
    try {
      return await NotificationModel.create(notificationData);
    } catch (error) {
      throw new Error('Database operation failed');

    }
  }


  async getAllUsers() {
    try {
      return await UserModel.find();
    } catch (error) {
      throw new Error('Database operation failed');

    }
  }





  async updateVendorServiceImages(vendorId: string, photoUrls: string[]): Promise<any> {
    try {
      console.log('Vendor ID and Photo URLs in Repository:', vendorId, photoUrls);
      const vendor = await VendorModel.findById(vendorId);
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      vendor.serviceImages = [...vendor.serviceImages, ...photoUrls];
      const updatedVendor = await vendor.save();
      console.log('Updated Vendor:', updatedVendor);
      return updatedVendor;
    } catch (error) {
      throw new Error(`Error updating service images: ${error}`);
    }
  }



}



