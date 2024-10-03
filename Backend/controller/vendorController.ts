import { NextFunction, Request, Response } from "express";
import {
  loginVendor, registerVendor, verifyAndSaveVendor, vendorAddress, uploadDishes,
  uploadImage, editVendor, findVendorById, uploadAuditorium, softDeleteDishService, findBookingDetails,
  findFoodVendorById, findAuditoriumVendorById, findDishesById, findAuditoriumById, softDeleteAuditoriumService
} from "../Service/vendorService.js";

import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { findVendorByEmail } from "../Repository/vendorRepo.js";
import { HttpStatus } from "../utils/httpStatus.js";
import { IMulterFile } from "../utils/type.js";
import { chatModel } from "../models/chatModel.js";
import { messageModel } from "../models/messageModal.js";
import { io } from "../index.js";


export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { vendorname, email, phone, password } = req.body;

    console.log(req.body, '');
    const proceedWithRegistration = async () => {
      try {
        const otp = otpGenerator();
        console.log('Generated OTP:', otp);
        await registerVendor({
          vendorname,
          phone,
          email,
          password,
          otp,
          reviews: "",
          address: "",
          district: "",
          state: ""
        });

        // Send OTP to vendor's email
        await sendEmail(email, otp);

        res.status(HttpStatus.OK).json("OTP sent to email");
      } catch (error: any) {
        console.error('Error during registration:', error.message);
        res.status(HttpStatus.BAD_REQUEST).json({ error: "Registration failed: " + error.message });
      }
    };

    await proceedWithRegistration(); // Properly handle the async function
  } catch (error: any) {
    next(error); // Forward any unexpected errors to the error-handling middleware
  }
};



export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);

    const vendor = await findVendorByEmail(email);
    console.log(vendor);

    if (!vendor) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor not found" });
      return;
    }

    if (vendor.otp === otp) {
      await verifyAndSaveVendor(email, otp);
      res.status(HttpStatus.OK).json("Vendor registered successfully");
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
    }
  } catch (error: any) {
    next(error);
  }
};


export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const { vendor, vendorToken } = await loginVendor(email, password);
    res.cookie("vendorToken", vendorToken,);
    res.status(HttpStatus.OK).json({ vendor, vendorToken });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: "Error: " + error.message });
  }
};



export const fetchAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("vann ta");

    const vendorAddresses = await vendorAddress();
    console.log(vendorAddresses);

    res.status(HttpStatus.OK).json(vendorAddresses);
  } catch (error) {
    next(error);
  }
};
;

// Edit vendor details


export const editVendorDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('controller');

    const vendorDetails = req.body;
    const file = req.file as unknown as IMulterFile;

    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await uploadImage(file);
    }
    const updatedVendor = await editVendor(vendorDetails, imageUrl);
    res.status(200).json({ ...updatedVendor, imageUrl }); // Include imageUrl if available

  } catch (error) {
    next(error); // Pass error to the error handler middleware
  }
};


export const fetchVendorDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('controller');
    const { vendorId } = req.params; // Extract vendorId from request params
    const vendor = await findVendorById(vendorId); // Fetch vendor details
    if (!vendor) {
      res.status(404).json({ message: "Vendor not found" });
    } else {
      res.status(200).json(vendor); // Return vendor details
    }
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};


export const fetchdishes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('controller');
    const { dishesId } = req.params;
    const vendor = await findDishesById(dishesId);
    if (!vendor) {
      res.status(404).json({ message: "Vendor not found" });
    } else {
      res.status(200).json(vendor);
    }
  } catch (error) {
    next(error);
  }
};



export const fetchauditorium = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('controller  indo audi ');
    const { auditoriumId } = req.params;
    console.log(auditoriumId, '---------------------------------------------------------------------------------');

    const vendor = await findAuditoriumById(auditoriumId);
    if (!vendor) {
      res.status(404).json({ message: "Vendor not found" });
    } else {
      res.status(200).json(vendor);
    }
  } catch (error) {
    next(error);
  }
};


interface ExtendedRequest extends Request {
  vendorId?: string; // Optional, since it might not be available in all cases
}

export const addDishes = async (req: ExtendedRequest, res: Response): Promise<Response> => {
  try {
    const { body } = req;
    const vendorId = req.vendorId;

    if (!vendorId) {
      return res.status(400).json({ error: "Vendor ID is required" });
    }

    const file = req.file as unknown as IMulterFile;

    let imageUrl: string | undefined = undefined;
    if (file) {
      imageUrl = await uploadImage(file);
    }

    // Passing the vendorId and body to the service function
    const dishesData = await uploadDishes(vendorId, body, imageUrl);

    if (dishesData) {
      return res.status(200).json("Dishes added successfully");
    } else {
      return res.status(400).json({ error: "Dishes not added: something went wrong" });
    }
  } catch (error) {
    console.error("Error adding dishes: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addAuditorium = async (req: ExtendedRequest, res: Response): Promise<Response> => {
  try {

    const { body } = req;
    const vendorId = req.vendorId;

    if (!vendorId) {
      return res.status(400).json({ error: "Vendor ID is required" });
    }

    const file = req.file as unknown as IMulterFile;

    let imageUrl: string | undefined = undefined;

    if (file) {
      imageUrl = await uploadImage(file);
    }

    const auditoriumData = await uploadAuditorium(vendorId, body, imageUrl);

    if (auditoriumData) {
      return res.status(200).json("Auditorium added successfully");
    } else {
      return res.status(400).json({ error: "Auditorium not added: something went wrong" });
    }
  } catch (error) {
    console.error("Error adding auditorium: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



export const fetchDetailsVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Controller invoked');

    const { vendorId } = req.params;
    const vendor = await findVendorById(vendorId);

    if (!vendor) {
      res.status(404).json({ message: "Vendor not found" });
    } else {
      console.log(vendor, 'bdhewbfew ');

      res.status(200).json(vendor);
    }

  } catch (error) {
    console.error('Error in fetchDetailsVendor:', error);
    next(error);
  }
};



export const fetchFoodDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { vendorId } = req.params;
    const dishes = await findFoodVendorById(vendorId);

    if (!dishes || dishes.length === 0) {
      res.status(404).json({ message: "No dishes found for this vendor" });
    } else {
      console.log(dishes, 'Fetched dishes for vendor');
      res.status(200).json(dishes);
    }

  } catch (error) {
    console.error('Error in fetchFoodDetails:', error);
    next(error);
  }
};


export const fetchAuditoriumDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Controller invoked');

    const { vendorId } = req.params;
    const auditorium = await findAuditoriumVendorById(vendorId);

    if (!auditorium || auditorium.length === 0) {
      res.status(404).json({ message: "No dishes found for this vendor" });
    } else {
      console.log(auditorium, 'Fetched dishes for vendor');
      res.status(200).json(auditorium);
    }
  } catch (error) {
    console.error('Error in fetchFoodDetails:', error);
    next(error);
  }
};





export const softDeleteDish = async (req: Request, res: Response) => {
  try {

    console.log('delete');

    const { dishId } = req.params;  

    if (!dishId) {
      return res.status(400).json({ message: 'Dish ID is missing' });
    }

    const updatedDish = await softDeleteDishService(dishId); // Call the service to soft delete the dish
    if (!updatedDish) {
      return res.status(404).json({ message: 'Dish not found or already deleted' });
    }

    res.status(200).json({ message: 'Dish deleted successfully', dish: updatedDish });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



export const softDeleteAuditorium = async (req: Request, res: Response) => {
  try {
    console.log('delete');
    const { auditoriumId } = req.params;
    if (!auditoriumId) {
      return res.status(400).json({ message: 'Auditorium ID is missing' });
    }
    const updatedAuditorium = await softDeleteAuditoriumService(auditoriumId); // Call the service to soft delete the auditorium
    if (!updatedAuditorium) {
      return res.status(404).json({ message: 'Auditorium not found or already deleted' });
    }

    res.status(200).json({ message: 'Auditorium deleted successfully', auditorium: updatedAuditorium });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const vendorBookingDetils = async (req: Request, res: Response) => {
  const { vendorId } = req.params;
  try {
    const booking = await findBookingDetails(vendorId); 

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking); 
  } catch (error) {
    console.error("Error fetching booking data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getUnreadMessagesCount = async (
  req: any,
  res: any
): Promise<void> => {
  const vendorId = req.vendorId;

  try {

    if (!vendorId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const chats = await chatModel.find({ vendorId: vendorId }).select('_id');
    const chatIds = chats.map(chat => chat._id);


    const unreadCount = await messageModel.countDocuments({
      chatId: { $in: chatIds },
      senderModel: "User",
      isRead: false,
    });

    io.to(vendorId).emit("unreadCount", {unreadCount});

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    res.status(500).json({ error: "Error fetching unread messages count" });
  }
};