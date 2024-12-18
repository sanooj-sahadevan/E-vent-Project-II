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
exports.AdminService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (process.env.ADMIN_EMAIL !== email) {
                    console.error(Error);
                }
                if (process.env.ADMIN_PASS !== password) {
                    console.error(Error);
                }
                const adminToken = jsonwebtoken_1.default.sign({
                    AdminEmail: email,
                }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return { adminToken, admin: email };
            }
            catch (error) {
                throw new Error;
            }
        });
    }
    getAllVendorsService() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.getAllVendorsFromDB();
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getAllBookingsService() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepository.getAllBookingsFromDB();
            }
            catch (error) {
                throw new Error;
            }
        });
    }
    blockVendor(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendor = yield this.adminRepository.findVendorById(vendorId);
            if (!vendor) {
                console.error(`Vendor with ID ${vendorId} not found`);
                throw new Error("Vendor not found");
            }
            if (vendor.isBlocked) {
                console.error(`Vendor with ID ${vendorId} is already blocked`);
                throw new Error("Vendor is already blocked");
            }
            return this.adminRepository.blockVendorById(vendorId);
        });
    }
    unblockVendor(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendor = yield this.adminRepository.findVendorById(vendorId);
            if (!vendor) {
                console.error(`Vendor with ID ${vendorId} not found`);
                throw new Error("Vendor not found");
            }
            if (!vendor.isBlocked) {
                console.error(`Vendor with ID ${vendorId} is already unblocked`);
                throw new Error("Vendor is already unblocked");
            }
            return this.adminRepository.unblockVendorById(vendorId);
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.adminRepository.findAllUsers();
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.adminRepository.findUserById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            if (user.isBlocked) {
                throw new Error("User is already blocked");
            }
            return this.adminRepository.blockUserById(userId);
        });
    }
    unblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.adminRepository.findUserById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            if (!user.isBlocked) {
                throw new Error("User is already unblocked");
            }
            return this.adminRepository.unblockUserById(userId);
        });
    }
    getDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalEvents = yield this.adminRepository.getTotalEvents();
                const totalRevenueResult = yield this.adminRepository.getTotalRevenue();
                const totalRevenue = totalRevenueResult || 0;
                const totalVendors = yield this.adminRepository.getTotalVendors();
                const totalUsers = yield this.adminRepository.getTotalUsers();
                return {
                    totalEvents,
                    totalRevenue,
                    totalVendors,
                    totalUsers,
                };
            }
            catch (error) {
                console.log("error in admin service: ", error);
            }
        });
    }
}
exports.AdminService = AdminService;
