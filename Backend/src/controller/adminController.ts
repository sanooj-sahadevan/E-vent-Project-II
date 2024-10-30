import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../utils/httpStatus";
import { IAdminService } from "../interfaces/service/adminService";

export class AdminController {

  private adminService: IAdminService

  constructor(adminService: IAdminService) {
    this.adminService = adminService
  }

  async adminlogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;
    try {
      const result = await this.adminService.loginUser(email, password);
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
  }

  async getAllVendors(req: Request, res: Response, next: NextFunction) {
    try {
      const allWorkers = await this.adminService.getAllVendorsService();
      res.status(HttpStatus.OK).json(allWorkers);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve workers" });
    }
  }

  async getAllBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const allBookings = await this.adminService.getAllBookingsService();
      res.status(HttpStatus.OK).json(allBookings);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve workers" });
    }
  }

  async blockVendorController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const vendorId = req.params.id;
      console.log("backend", vendorId);

      const blockedCompany = await this.adminService.blockVendor(vendorId);

      res.status(HttpStatus.OK).json({
        message: "Vendor blocked successfully",
        vendor: blockedCompany,
      });
    } catch (error) {
      next(error);
    }
  }


  async unblockVendorController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const vendorId = req.params.id;

      const unblockedVendor = await this.adminService.unblockVendor(vendorId);

      res.status(HttpStatus.OK).json({
        message: "Vendor unblocked successfully",
        vendor: unblockedVendor,
      });
    } catch (error) {
      next(error);
    }
  }


  
  async getUsersList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await this.adminService.getAllUsers();
      res.status(HttpStatus.OK).json(users);
    } catch (error) {
      next(error);
    }
  }

  async blockUserController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.params.id;
      console.log("backend", userId);

      const blockedUser = await this.adminService.blockUser(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: "User blocked successfully", user: blockedUser });
    } catch (error) {
      next(error);
    }
  }

  async unblockUserController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.params.id;

      const unblockedUser = await this.adminService.unblockUser(userId);
      res
        .status(HttpStatus.OK)
        .json({ message: "User unblocked successfully", user: unblockedUser });
    } catch (error) {
      next(error);
    }
  }

  async DashboardController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dashboardData = await this.adminService.getDashboardData();
      return res.status(HttpStatus.OK).json(dashboardData);
    } catch (error: any) {
      next(error);
    }
  }
};
