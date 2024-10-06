"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminService_js_1 = __importDefault(require("../Service/adminService.js"));
const httpStatus_js_1 = require("../utils/httpStatus.js");
exports.default = {
    adminlogin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const result = yield adminService_js_1.default.loginUser(email, password);
            console.log(result);
            if (result) {
                res.cookie("adminToken", result.adminToken);
                res.json({ adminToken: result.adminToken, admin: result.admin });
            }
            else {
                res.status(httpStatus_js_1.HttpStatus.UNAUTHORIZED).json({ message: "Login failed" });
            }
        }
        catch (error) {
            next(error);
        }
    }),
    getAllVendors: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allWorkers = yield adminService_js_1.default.getAllVendorsService();
            res.status(httpStatus_js_1.HttpStatus.OK).json(allWorkers);
        }
        catch (err) {
            res.status(httpStatus_js_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve workers" });
        }
    }),
    getAllBookings: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allBookings = yield adminService_js_1.default.getAllBookingsService();
            res.status(httpStatus_js_1.HttpStatus.OK).json(allBookings);
        }
        catch (err) {
            res.status(httpStatus_js_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve workers" });
        }
    }),
    blockVendorController: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendorId = req.params.id;
            console.log("backend", vendorId);
            const blockedCompany = yield adminService_js_1.default.blockVendor(vendorId);
            res.status(httpStatus_js_1.HttpStatus.OK).json({
                message: "Vendor blocked successfully",
                vendor: blockedCompany,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    unblockVendorController: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendorId = req.params.id;
            const unblockedVendor = yield adminService_js_1.default.unblockVendor(vendorId);
            res.status(httpStatus_js_1.HttpStatus.OK).json({
                message: "Vendor unblocked successfully",
                vendor: unblockedVendor,
            });
        }
        catch (error) {
            next(error);
        }
    }),
    getUsersList: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield adminService_js_1.default.getAllUsers();
            res.status(httpStatus_js_1.HttpStatus.OK).json(users);
        }
        catch (error) {
            next(error);
        }
    }),
    blockUserController: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            console.log("backend", userId);
            const blockedUser = yield adminService_js_1.default.blockUser(userId);
            res
                .status(httpStatus_js_1.HttpStatus.OK)
                .json({ message: "User blocked successfully", user: blockedUser });
        }
        catch (error) {
            next(error);
        }
    }),
    unblockUserController: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const unblockedUser = yield adminService_js_1.default.unblockUser(userId);
            res
                .status(httpStatus_js_1.HttpStatus.OK)
                .json({ message: "User unblocked successfully", user: unblockedUser });
        }
        catch (error) {
            next(error);
        }
    }),
    DashboardController: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const dashboardData = yield adminService_js_1.default.getDashboardData();
            return res.status(httpStatus_js_1.HttpStatus.OK).json(dashboardData);
        }
        catch (error) {
            next(error);
        }
    }),
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
