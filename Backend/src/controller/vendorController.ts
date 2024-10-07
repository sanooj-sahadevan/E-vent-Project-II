import { NextFunction, Request, Response } from "express";
// import userService from "../Service/vendorService"

import { HttpStatus } from "../utils/httpStatus";
import { IMulterFile } from "../utils/type";
import { otpGenerator } from "../utils/otpGenerator";
import { sendEmail } from "../utils/sendEmail";


export class VendorController{
  private vendorService

  constructor(vendorService:any){
    this.vendorService = vendorService
  }


  async register  (req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
    const { vendorname, email, phone, password } = req.body;

    const proceedWithRegistration = async () => {
      try {
        const otp = otpGenerator();
        await this.vendorService.registerVendor({
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

        await sendEmail(email, otp);
        res.status(HttpStatus.OK).json("OTP sent to email");
      } catch (error: any) {
        next(error);
      }
    };

    await proceedWithRegistration();
  } catch (error: any) {
    next(error);
  }
}

async verifyOtp  (req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);

    const vendor = await this.vendorService.findVendorByEmailService(email);
    console.log(vendor);

    if (!vendor) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor not found" });
      return;
    }

    if (vendor.otp === otp) {
      await this.vendorService.verifyAndSaveVendor(email, otp);
      res.status(HttpStatus.OK).json("Vendor registered successfully");
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
    }
  } catch (error: any) {
    next(error);
  }
}

async login  (req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
    const { email, password } = req.body;
    const { vendor, vendorToken } = await this.vendorService.loginVendor(email, password);
    res.cookie("vendorToken", vendorToken,);
    res.status(HttpStatus.OK).json({ vendor, vendorToken });
  } catch (error: any) {
    next(error);
  }
}


async fetchAddress  (req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
    console.log("vann ta");

    const vendorAddresses = await this.vendorService.vendorAddress();
    console.log(vendorAddresses);

    res.status(HttpStatus.OK).json(vendorAddresses);
  } catch (error) {
    next(error);
  }
}


async editVendorDetails  (req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
    const vendorDetails = req.body;
    const file = req.file as unknown as IMulterFile;

    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.vendorService.uploadImage(file);
    }
    const updatedVendor = await this.vendorService.editVendorService(vendorDetails, imageUrl);
    res.status(HttpStatus.OK).json({ ...updatedVendor, imageUrl }); 

  } catch (error) {
    next(error); 
  }
}


async fetchVendorDetails  (req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
    console.log('controller');
    const { vendorId } = req.params; // Extract vendorId from request params
    const vendor = await this.vendorService.findVendorById(vendorId); // Fetch vendor details
    if (!vendor) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Vendor not found" });
    } else {
      res.status(HttpStatus.OK).json(vendor);
    }
  } catch (error) {
    next(error);
  }
}

async fetchdishes  (req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
 
    const { dishesId } = req.params;
    const vendor = await this.vendorService.findDishesById(dishesId);
      res.status(HttpStatus.OK).json(vendor);
  } catch (error) {
    next(error);
  }
}


async fetchauditorium  (req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
    const { auditoriumId } = req.params;
    const vendor = await  this.vendorService.findAuditoriumById(auditoriumId);
      res.status(HttpStatus.OK).json(vendor);
  } catch (error) {
    next(error);
  }
}



 async addDishes  (req: Request & { vendorId?: string }, res: Response, next: NextFunction)  {
  try {
    const { body } = req;
    const vendorId = req.vendorId    
    if (!vendorId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor ID is required" });
    }
    const file = req.file as unknown as IMulterFile;
    let imageUrl: string | undefined = undefined;
    if (file) {
      imageUrl = await  this.vendorService.uploadImage(file);
    }
    await  this.vendorService.uploadDishes(vendorId, body, imageUrl);
    return res.status(HttpStatus.OK).json("Dishes added successfully");

  } catch (error) {
    console.error("Error adding dishes: ", error);
    next(error);
  }
}

async addAuditorium  (req: Request & { vendorId?: string }, res: Response, next: NextFunction)  {
  try {

    const { body } = req;
    const vendorId = req.vendorId;

    if (!vendorId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor ID is required" });
    }

    const file = req.file as unknown as IMulterFile;

    let imageUrl: string | undefined = undefined;

    if (file) {
      imageUrl = await  this.vendorService.uploadImage(file);
    }

    const auditoriumData = await  this.vendorService.uploadAuditorium(vendorId, body, imageUrl);

    if (auditoriumData) {
      return res.status(HttpStatus.OK).json("Auditorium added successfully");
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: "Auditorium not added: something went wrong" });
    }
  } catch (error) {
    console.error("Error adding auditorium: ", error);
    next(error);
  }
}


async fetchDetailsVendor  (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { vendorId } = req.params;
    const vendor = await  this.vendorService.findVendorById(vendorId);
      res.status(HttpStatus.OK).json(vendor);

  } catch (error) {
    console.error('Error in fetchDetailsVendor:', error);
    next(error);
  }
}


async fetchFoodDetails  (req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
    const { vendorId } = req.params;
    const dishes = await  this.vendorService.findFoodVendorById(vendorId);
    if (!dishes || dishes.length === 0) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "No dishes found for this vendor" });
    } else {
      console.log(dishes, 'Fetched dishes for vendor');
      res.status(HttpStatus.OK).json(dishes);
    }

  } catch (error) {
    console.error('Error in fetchFoodDetails:', error);
    next(error);
  }
}

async fetchAuditoriumDetails  (req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
    const { vendorId } = req.params;
    const auditorium = await  this.vendorService.findAuditoriumVendorById(vendorId);

    if (!auditorium || auditorium.length === 0) {
      res.status(HttpStatus.NOT_FOUND).json({ message: "No dishes found for this vendor" });
    } else {
      console.log(auditorium, 'Fetched dishes for vendor');
      res.status(HttpStatus.OK).json(auditorium);
    }
  } catch (error) {
    console.error('Error in fetchFoodDetails:', error);
    next(error);
  }
}




async softDeleteDish  (req: Request, res: Response, next: NextFunction)  {
  try {
    const { dishId } = req.params;
    if (!dishId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Dish ID is missing' });
    }
    const updatedDish = await  this.vendorService.softDeleteDishService(dishId); 
    res.status(HttpStatus.OK).json({ message: 'Dish deleted successfully', dish: updatedDish });
  } catch (error) {
    next(error);
  }
}


async softDeleteAuditorium  (req: Request, res: Response, next: NextFunction)  {
  try {
    const { auditoriumId } = req.params;
    if (!auditoriumId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Auditorium ID is missing' });
    }
    const updatedAuditorium = await  this.vendorService.softDeleteAuditoriumService(auditoriumId); 
    res.status(HttpStatus.OK).json({ message: 'Auditorium deleted successfully', auditorium: updatedAuditorium });
  } catch (error) {
    next(error);
  }
}


async vendorBookingDetils (req: Request, res: Response, next: NextFunction)  {
  const { vendorId } = req.params;
  try {
    const booking = await  this.vendorService.findBookingDetails(vendorId)
    res.status(HttpStatus.OK).json(booking);
  } catch (error) {
    next(error);


  }
}

async getUnreadMessagesCount  (
  req: any,
  res: any, next: NextFunction
): Promise<void>  {
  const vendorId = req.vendorId;

  try {
    if (!vendorId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor ID is required" });
    }

    const chatServiceData = await  this.vendorService.chatServices({ vendorId });

    const chatIds = chatServiceData.map((chat: any) => chat._id);

    if (chatIds.length === 0) {
      return res.status(HttpStatus.OK).json({ unreadCount: 0 });
    }

    const unreadCount = await  this.vendorService.messageService({ chatIds, vendorId });
    res.status(HttpStatus.OK).json({ unreadCount });
  } catch (error) {
    next(error);

  }
}

 
}

// export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { vendorname, email, phone, password } = req.body;

//     const proceedWithRegistration = async () => {
//       try {
//         const otp = otpGenerator();
//         await registerVendor({
//           vendorname,
//           phone,
//           email,
//           password,
//           otp,
//           reviews: "",
//           address: "",
//           district: "",
//           state: ""
//         });

//         await sendEmail(email, otp);
//         res.status(HttpStatus.OK).json("OTP sent to email");
//       } catch (error: any) {
//         console.error('Error during registration:', error.message);
//         res.status(HttpStatus.BAD_REQUEST).json({ error: "Registration failed: " + error.message });
//       }
//     };

//     await proceedWithRegistration();
//   } catch (error: any) {
//     next(error);
//   }
// };

// export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { email, otp } = req.body;
//     console.log(email, otp);

//     const vendor = await findVendorByEmailService(email);
//     console.log(vendor);

//     if (!vendor) {
//       res.status(HttpStatus.BAD_REQUEST).json({ error: "Vendor not found" });
//       return;
//     }

//     if (vendor.otp === otp) {
//       await verifyAndSaveVendor(email, otp);
//       res.status(HttpStatus.OK).json("Vendor registered successfully");
//     } else {
//       res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
//     }
//   } catch (error: any) {
//     next(error);
//   }
// };


// export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { email, password } = req.body;
//     const { vendor, vendorToken } = await loginVendor(email, password);
//     res.cookie("vendorToken", vendorToken,);
//     res.status(HttpStatus.OK).json({ vendor, vendorToken });
//   } catch (error: any) {
//     next(error);
//   }
// };



// export const fetchAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     console.log("vann ta");

//     const vendorAddresses = await vendorAddress();
//     console.log(vendorAddresses);

//     res.status(HttpStatus.OK).json(vendorAddresses);
//   } catch (error) {
//     next(error);
//   }
// };



// export const editVendorDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const vendorDetails = req.body;
//     const file = req.file as unknown as IMulterFile;

//     let imageUrl: string | undefined;
//     if (file) {
//       imageUrl = await uploadImage(file);
//     }
//     const updatedVendor = await editVendorService(vendorDetails, imageUrl);
//     res.status(200).json({ ...updatedVendor, imageUrl }); 

//   } catch (error) {
//     next(error); 
//   }
// };



// export const fetchVendorDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     console.log('controller');
//     const { vendorId } = req.params; // Extract vendorId from request params
//     const vendor = await findVendorById(vendorId); // Fetch vendor details
//     if (!vendor) {
//       res.status(404).json({ message: "Vendor not found" });
//     } else {
//       res.status(200).json(vendor);
//     }
//   } catch (error) {
//     next(error);
//   }
// };


// export const fetchdishes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
 
//     const { dishesId } = req.params;
//     const vendor = await findDishesById(dishesId);
//       res.status(200).json(vendor);
//   } catch (error) {
//     next(error);
//   }
// };



// export const fetchauditorium = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { auditoriumId } = req.params;
//     const vendor = await findAuditoriumById(auditoriumId);
//       res.status(200).json(vendor);
//   } catch (error) {
//     next(error);
//   }
// };


// interface ExtendedRequest extends Request {
//   vendorId?: string;
// }

// export const addDishes = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
//   try {
//     const { body } = req;
//     const vendorId = req.vendorId;
//     if (!vendorId) {
//       return res.status(400).json({ error: "Vendor ID is required" });
//     }
//     const file = req.file as unknown as IMulterFile;
//     let imageUrl: string | undefined = undefined;
//     if (file) {
//       imageUrl = await uploadImage(file);
//     }
//     await uploadDishes(vendorId, body, imageUrl);

//     return res.status(400).json({ error: "Dishes not added: something went wrong" });

//   } catch (error) {
//     console.error("Error adding dishes: ", error);
//     next(error);
//   }
// };

// export const addAuditorium = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
//   try {

//     const { body } = req;
//     const vendorId = req.vendorId;

//     if (!vendorId) {
//       return res.status(400).json({ error: "Vendor ID is required" });
//     }

//     const file = req.file as unknown as IMulterFile;

//     let imageUrl: string | undefined = undefined;

//     if (file) {
//       imageUrl = await uploadImage(file);
//     }

//     const auditoriumData = await uploadAuditorium(vendorId, body, imageUrl);

//     if (auditoriumData) {
//       return res.status(200).json("Auditorium added successfully");
//     } else {
//       return res.status(400).json({ error: "Auditorium not added: something went wrong" });
//     }
//   } catch (error) {
//     console.error("Error adding auditorium: ", error);
//     next(error);
//   }
// };



// export const fetchDetailsVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { vendorId } = req.params;
//     const vendor = await findVendorById(vendorId);
//       res.status(200).json(vendor);

//   } catch (error) {
//     console.error('Error in fetchDetailsVendor:', error);
//     next(error);
//   }
// };



// export const fetchFoodDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { vendorId } = req.params;
//     const dishes = await findFoodVendorById(vendorId);
//     if (!dishes || dishes.length === 0) {
//       res.status(404).json({ message: "No dishes found for this vendor" });
//     } else {
//       console.log(dishes, 'Fetched dishes for vendor');
//       res.status(200).json(dishes);
//     }

//   } catch (error) {
//     console.error('Error in fetchFoodDetails:', error);
//     next(error);
//   }
// };


// export const fetchAuditoriumDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { vendorId } = req.params;
//     const auditorium = await findAuditoriumVendorById(vendorId);

//     if (!auditorium || auditorium.length === 0) {
//       res.status(404).json({ message: "No dishes found for this vendor" });
//     } else {
//       console.log(auditorium, 'Fetched dishes for vendor');
//       res.status(200).json(auditorium);
//     }
//   } catch (error) {
//     console.error('Error in fetchFoodDetails:', error);
//     next(error);
//   }
// };





// export const softDeleteDish = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { dishId } = req.params;
//     if (!dishId) {
//       return res.status(400).json({ message: 'Dish ID is missing' });
//     }
//     const updatedDish = await softDeleteDishService(dishId); 
//     res.status(200).json({ message: 'Dish deleted successfully', dish: updatedDish });
//   } catch (error) {
//     next(error);
//   }
// };



// export const softDeleteAuditorium = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { auditoriumId } = req.params;
//     if (!auditoriumId) {
//       return res.status(400).json({ message: 'Auditorium ID is missing' });
//     }
//     const updatedAuditorium = await softDeleteAuditoriumService(auditoriumId); 
//     res.status(200).json({ message: 'Auditorium deleted successfully', auditorium: updatedAuditorium });
//   } catch (error) {
//     next(error);
//   }
// };


// export const vendorBookingDetils = async (req: Request, res: Response, next: NextFunction) => {
//   const { vendorId } = req.params;
//   try {
//     const booking = await findBookingDetails(vendorId)
//     res.status(200).json(booking);
//   } catch (error) {
//     next(error);


//   }
// };




// export const getUnreadMessagesCount = async (
//   req: any,
//   res: any, next: NextFunction
// ): Promise<void> => {
//   const vendorId = req.vendorId;

//   try {
//     if (!vendorId) {
//       return res.status(400).json({ error: "Vendor ID is required" });
//     }

//     const chatServiceData = await chatServices({ vendorId });

//     const chatIds = chatServiceData.map((chat: any) => chat._id);

//     if (chatIds.length === 0) {
//       return res.status(200).json({ unreadCount: 0 });
//     }

//     const unreadCount = await messageService({ chatIds, vendorId });
//     res.status(200).json({ unreadCount });
//   } catch (error) {
//     next(error);

//   }
// };
