import { Request, Response, NextFunction } from "express";
import adminService from "../Service/adminService.js";
import { HttpStatus } from "../utils/httpStatus.js";

export default {
  adminlogin: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email, password } = req.body;
    try {
      const result = await adminService.loginUser(email, password);
      console.log(result);

      if (result) {
        res.cookie("adminToken", result.adminToken);
        res.json({ adminToken: result.adminToken, admin: result.admin });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Login failed" });
      }
    } catch (error) {
      next(error);
    }
  },

  getAllVendors: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allWorkers = await adminService.getAllVendorsService();
      res.status(HttpStatus.OK).json(allWorkers);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve workers" });
    }
  },

  getAllBookings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allBookings = await adminService.getAllBookingsService();
      res.status(HttpStatus.OK).json(allBookings);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve workers" });
    }
  },

  blockVendorController: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const vendorId = req.params.id;
      console.log("backend", vendorId);

      const blockedCompany = await adminService.blockVendor(vendorId);

      res.status(HttpStatus.OK).json({
        message: "Vendor blocked successfully",
        vendor: blockedCompany,
      });
    } catch (error) {
      next(error);
    }
  },
  unblockVendorController: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const vendorId = req.params.id;

      const unblockedVendor = await adminService.unblockVendor(vendorId);

      res.status(HttpStatus.OK).json({
        message: "Vendor unblocked successfully",
        vendor: unblockedVendor,
      });
    } catch (error) {
      next(error);
    }
  },

  getUsersList: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await adminService.getAllUsers();
      res.status(HttpStatus.OK).json(users);
    } catch (error) {
      next(error);
    }
  },
  blockUserController: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      console.log("backend", userId);

      const blockedUser = await adminService.blockUser(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: "User blocked successfully", user: blockedUser });
    } catch (error) {
      next(error);
    }
  },
  unblockUserController: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;

      const unblockedUser = await adminService.unblockUser(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: "User unblocked successfully", user: unblockedUser });
    } catch (error) {
      next(error);
    }
  },

  DashboardController: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dashboardData = await adminService.getDashboardData();
      return res.status(HttpStatus.OK).json(dashboardData);
    } catch (error: any) {
      next(error);
    }
  },
};

// export const adminlogin = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {

//     console.log('admin login');

//     const { email, password } = req.body;
//     try {
//       const result = await loginUser(email, password);
//       console.log(result);

//       if (result) {
//         res.cookie("adminToken", result.adminToken);
//         res.json({ adminToken: result.adminToken, admin: result.admin });
//       } else {
//         res.status(401).json({ message: "Login failed" });
//       }
//     } catch (error) {
//       next(error);
//     }
//   };

// export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const allBookings = await getAllBookingsService();
//     res.status(200).json(allBookings);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to retrieve workers" });
//   }
// };

// export const blockVendorController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const vendorId = req.params.id;
//     console.log("backend", vendorId);

//     const blockedCompany = await blockVendor(vendorId);

//     res.status(200).json({
//       message: "Vendor blocked successfully",
//       vendor: blockedCompany,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const unblockVendorController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const vendorId = req.params.id;

//     const unblockedVendor = await unblockVendor(vendorId);

//     res.status(200).json({
//       message: "Vendor unblocked successfully",
//       vendor: unblockedVendor,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getUsersList = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const users = await getAllUsers();
//     res.status(200).json(users);
//   } catch (error) {
//     next(error);
//   }
// };

// export const blockUserController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = req.params.id;
//     console.log("backend", userId);

//     const blockedUser = await blockUser(userId);
//     res
//       .status(200)
//       .json({ message: "User blocked successfully", user: blockedUser });
//   } catch (error) {
//     next(error);
//   }
// };

// export const unblockUserController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = req.params.id;

//     const unblockedUser = await unblockUser(userId);
//     res
//       .status(200)
//       .json({ message: "User unblocked successfully", user: unblockedUser });
//   } catch (error) {
//     next(error);
//   }
// };

// export const DashboardController = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const dashboardData = await getDashboardData();
//     return res.status(200).json(dashboardData);
//   } catch (error: any) {
//     next(error);
//   }
// };
