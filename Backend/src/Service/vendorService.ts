import jwt from "jsonwebtoken";
// import { Vendor } from "../interfaces/vendor";
import { uploadToS3Bucket } from "../middleware/fileUpload";
import { io } from "../index";
import { DishDocument } from "../interfaces/dishes";
import { AuditoriumDocument } from "../models/auditoriumModel";
import { IVendorRepository } from "../interfaces/repository/vendorRepository";
import { IVendorService } from "../interfaces/service/vendorService";
import notifyDishAdded from "../utils/notificationHelper/notification";
import mongoose from "mongoose";
import { ISlot } from "../interfaces/slot";


export class VendorService implements IVendorService {
  private vendorRepository: IVendorRepository

  constructor(vendorRepository:IVendorRepository){
    this.vendorRepository = vendorRepository
  }

  async registerVendor(vendor: any)  {
    try {
      const existingVendor = await this.vendorRepository.findVendorByEmail(vendor.email);
      console.log(existingVendor);
  
      if (existingVendor) {
        if (existingVendor.otpVerified) {
          throw new Error("User already exists");
        } else {
          await this.vendorRepository.updateVendor(existingVendor.email, vendor);
          return existingVendor;
        }
      }
      return await this.vendorRepository.createVendor(vendor);
    } catch (error) {
      console.error("Error during user registration:", error);
  
      throw error;
    }
  }
  
  async verifyAndSaveVendor  (email: string, otp: string)  {
    const vendor = await this.vendorRepository.findVendorByEmail(email);
    if (vendor && vendor.otp === otp) {
      vendor.otp = undefined;
      vendor.otpVerified = true;
      await vendor.save();
      return vendor;
    }
    throw new Error("Invalid OTP");
  }

 async loginVendor  (email: string, password: string)  {
    const vendor = await this.vendorRepository.findVendorByEmail(email);
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
  }
  async  vendorAddress  () {
    try {
      return await this.vendorRepository.vendorAddressFromDB();
    } catch (error) {
      throw new Error('Failed to fetch vendor addresses');
    }
  }
  
  
  async editVendorService(vendorDetails: any): Promise<any> {
    try {
      const existingVendor = await this.vendorRepository.findVendorByEmailRepo(vendorDetails.email);
  
      if (existingVendor) {
        return await this.vendorRepository.editVendorRepo(existingVendor, vendorDetails);
      } else {
        return await this.vendorRepository.editVendorRepo(null, vendorDetails);
      }
    } catch (error) {
      console.error('Error in editVendorService:', error);
      throw new Error('Failed to update vendor details');
    }
  }
  
  
  
  
  async uploadImage(fileName: string, fileType: string): Promise<string> {
    try {
        console.log("Generating pre-signed URL for file:", fileName, "with type:", fileType);  // Log the details
        const presignedUrl = await uploadToS3Bucket(fileName, fileType);
        return presignedUrl;
    } catch (error: any) {
        throw new Error(error.message);
    }
  }
  

  
  async  findVendorById  (vendorId: string)  {
    try {
      const vendor = await this.vendorRepository.findVendorByIdInDb(vendorId);
      if (!vendor) {
        throw new Error(`Error finding vendor`);
      }
      return vendor;
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  }

  async findAuditoriumById  (auditoriumId: string)  {
    try {
      console.log('controller 2');
      const vendor = await this.vendorRepository.findAuditoriumByIdInDb(auditoriumId);
      if(!vendor){
        throw new Error(`Error finding vendor`);
      }
      return vendor;
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  }
  
  
  async findDishesById  (dishesId: string)  {
    try {
      
      const vendor = await this.vendorRepository.findDishesByIdInDb(dishesId);
      if(!vendor){
        throw new Error(`Error finding vendor`);
      }
      return vendor;
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  }
  
  // async  uploadDishes  (
  //   vendorId: string,
  //   data: DishDocument,
  //   images?: string
  // ) {
  //   try {      
  //     const dishesData = { vendorId, data, images };
  
  //     dishesData.data.price = Number(dishesData.data.price);
  
  //     const newDish = await this.vendorRepository.createDishes(dishesData);
  // console.log(newDish);
  
  //     return newDish;
  //   } catch (error) {
  //     console.error("Error in uploadDishes: ", error);
  //     console.error();
  //   }
  // }


  async uploadDishes(vendorId: string, data: DishDocument, images?: string) {
    try {
      const dishesData = { vendorId, data, images };
      dishesData.data.price = Number(dishesData.data.price);
  
      const newDish = await this.vendorRepository.createDishes(dishesData);
      console.log(newDish);
      const dishNotification = await notifyDishAdded(vendorId, newDish._id, newDish.name);
      console.log(dishNotification);


      return newDish;
    } catch (error) {
      console.error("Error in uploadDishes: ", error);
    }
  }
  
  async uploadAuditorium  (
    vendorId: string,
    data: AuditoriumDocument,
    images?: string
  ) {
    try {
      const auditoriumData = { vendorId, data, images };
      auditoriumData.data.price = Number(auditoriumData.data.price);
  
      const newAuditorium = await this.vendorRepository.createAuditorium(auditoriumData);
  
      return newAuditorium;
    } catch (error) {
      console.error("Error in uploadAuditorium: ", error);
      throw error;
    }
  }
  
  
  async findFoodVendorById (vendorId: string) {
    try {
      console.log('Service invoked to find dishes for vendor:', vendorId);
      const dishes = await this.vendorRepository.findFoodVendorIdInDb(vendorId);
      return dishes;
    } catch (error) {
      throw new Error(`Error finding vendor dishes: ${error}`);
    }
  }
  
  async findReviewsVendorById (vendorId: string) {
    try {
      console.log('Service invoked to find reviews for vendor:', vendorId);
      const dishes = await this.vendorRepository.findReviewsVendorIdInDb(vendorId);
      return dishes;
    } catch (error) {
      throw new Error(`Error finding vendor dishes: ${error}`);
    }
  }
  
  
  
  async findAuditoriumVendorById  (vendorId: string) {
    try {
      console.log('Service invoked to find auditorium for vendor:', vendorId);
      const Auditorium = await this.vendorRepository.findAuditoriumVendorIdInDb(vendorId);
      return Auditorium;
    } catch (error) {
      throw new Error(`Error finding vendor dishes: ${error}`);
    }
  }
  
  
  async softDeleteDishService  (dishId: string) {
    try {
      const updatedDish = await this.vendorRepository.softDeleteDishRepo(dishId);
      if(!updatedDish){
        throw new Error(`Error soft-deleting dish`);
      }
      return updatedDish;
    } catch (error) {
      throw new Error(`Error soft-deleting dish: ${error}`);
    }
  }
  
  
  async  softDeleteAuditoriumService  (auditoriumId: string)  {
    try {
      const updatedAuditorium = await this.vendorRepository.softDeleteAuditoriumRepo(auditoriumId);
      if(!updatedAuditorium){
        throw new Error(`Error soft-deleting auditorium`);
      }
      return updatedAuditorium;
    } catch (error) {
      throw new Error(`Error soft-deleting auditorium: ${error}`);
    }
  }
  
  async  reviewIdService  (reviewId: string)  {
    try {
      const updatedreview = await this.vendorRepository.updatedreviewRepo(reviewId);
      if(!updatedreview){
        throw new Error(`Error soft-deleting auditorium`);
      }
      return updatedreview;
    } catch (error) {
      throw new Error(`Error soft-deleting auditorium: ${error}`);
    }
  }


  async    reviewIdServiceReject  (reviewId: string)  {
    try {
      const deletereview = await this.vendorRepository.updatedreviewRepoReject(reviewId);
      if(!deletereview){
        throw new Error(`Error soft-deleting auditorium`);
      }
      return deletereview;
    } catch (error) {
      throw new Error(`Error soft-deleting auditorium: ${error}`);
    }
  }
  
  async findBookingDetails  (vendorId: string)  {
    try {
      const bookingDetails = await this.vendorRepository.findDetailsByvendorId(vendorId);
      if(!bookingDetails){
        throw new Error(`Error soft-deleting auditorium`);
      }
        return bookingDetails
    } catch (error) {
      throw new Error(`Error soft-deleting auditorium: ${error}`);
  
    }
  }
  
  
  
  
  async findVendorByEmailService (email: string)  {
    try {
      const vendor = await this.vendorRepository.findVendorByEmail(email);
      return vendor
    } catch (error) {
      console.error(error);
  
    }
  }
  
  
  async chatServices  ({ vendorId }: { vendorId: string })  {
    try {
      const chats = await this.vendorRepository.chatDB(vendorId);
      return chats;
    } catch (error) {
      console.error("Error fetching chats:", error);
      throw error;
    }
  }

  async messageService  ({
    chatIds,
    vendorId,
  }: {
    chatIds: string[];
    vendorId: string;
  })  {
    try {
      const unreadCount = await this.vendorRepository.messageDB(chatIds);
  
      io.to(vendorId).emit("unreadCount", { unreadCount });
  
      return unreadCount;
    } catch (error) {
      console.error("Error fetching unread messages:", error);
      throw error;
    }
  }  





async createWorkerSlots(vendorId: string, startDate: Date, endDate: Date): Promise<ISlot[]> {
  const slots: ISlot[] = [];
  const workerObjectId = new mongoose.Types.ObjectId(vendorId);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (startDate <= today) {
    throw new Error("Start date must be tomorrow or a future date.");
  }

  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const existingSlot = await this.vendorRepository.findSlotByWorkerAndDate(workerObjectId, currentDate);
  
    if (existingSlot) {
      throw new Error(`Slot already exists for vendor ${vendorId} on ${currentDate.toDateString()}`);
    }
  
    const slot = await this.vendorRepository.createSlot({
      vendorId: workerObjectId,
      date: new Date(currentDate),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  
    slots.push(slot);
    currentDate.setDate(currentDate.getDate() + 1); 
  }
  
  return slots;
}



async getSlotsByWorkerId(vendorId: string): Promise<ISlot[]> {
  try {
    return await this.vendorRepository.getSlotsByWorkerIdFromRepo(vendorId);
  } catch (error) {
    console.error("Error fetching slots from repository:", error);
    throw error; 
  }
}

}
