import { Request, Response, NextFunction } from 'express';
import { loginUser,getAllVendorsService,unblockVendor,blockVendor,getAllBookingsService,getDashboardData,
  getAllUsers,blockUser,unblockUser } from '../Service/adminService.js';
import { HttpStatus } from '../utils/httpStatus.js';


export const adminlogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  console.log('admin login');
  
  const { email, password } = req.body;
  try {
    const result = await loginUser(email, password);
    console.log(result);

    if (result) {
      res.cookie("adminToken", result.adminToken);
      res.json({ adminToken: result.adminToken, admin: result.admin });
    } else {
      res.status(401).json({ message: "Login failed" });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const allWorkers = await getAllVendorsService();
    res.status(200).json(allWorkers);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve workers" });
  }
};


export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const allBookings = await getAllBookingsService();
    res.status(200).json(allBookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve workers" });
  }
};



export const blockVendorController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.params.id;
    console.log("backend", vendorId);

    const blockedCompany = await blockVendor(vendorId);

    res.status(200).json({
      message: "Vendor blocked successfully",
      vendor: blockedCompany,
    });
  } catch (error) {
    next(error);
  }
};

export const unblockVendorController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.params.id;

    const unblockedVendor = await unblockVendor(vendorId);

    res.status(200).json({
      message: "Vendor unblocked successfully",
      vendor: unblockedVendor,
    });
  } catch (error) {
    next(error);
  }
};


// Get all users
export const getUsersList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Block a user
export const blockUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    console.log("backend", userId);

    const blockedUser = await blockUser(userId);
    res
      .status(200)
      .json({ message: "User blocked successfully", user: blockedUser });
  } catch (error) {
    next(error);
  }
};

// Unblock a user
export const unblockUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;

    const unblockedUser = await unblockUser(userId);
    res
      .status(200)
      .json({ message: "User unblocked successfully", user: unblockedUser });
  } catch (error) {
    next(error);
  }
};








export const DashboardController = async (req: any, res: any) => {
  try {
    
    const dashboardData = await getDashboardData();
    return res.status(200).json(dashboardData);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};