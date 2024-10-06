import jwt from 'jsonwebtoken';
import adminRepositary from "../Repository/adminRepo";


export default {

  loginUser: async (
    email: string,
    password: string
  ) => {
    try {
      if (process.env.ADMIN_EMAIL !== email) {
        console.error(Error);
      }
      if (process.env.ADMIN_PASS !== password) {
        console.error(Error);
      }

      const adminToken = jwt.sign(
        {
          AdminEmail: email,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      return { adminToken, admin: email };
    } catch (error) {
      console.error(error);

    }
  },
  getAllVendorsService: async () => {
    try {
      return await adminRepositary.getAllVendorsFromDB();
    } catch (error) {
      console.error(error);
    }
  },

  getAllBookingsService: async () => {
    try {
      return await adminRepositary.getAllBookingsFromDB();
    } catch (error) {
      console.error(error);
    }
  },

  blockVendor: async (
    vendorId: string
  ) => {
    const vendor = await adminRepositary.findVendorById(vendorId);
    if (!vendor) {
      console.error(`Vendor with ID ${vendorId} not found`);
      throw new Error("Vendor not found");
    }
    if (vendor.isBlocked) {
      console.error(`Vendor with ID ${vendorId} is already blocked`);
      throw new Error("Vendor is already blocked");
    }

    return adminRepositary.blockVendorById(vendorId);
  },
  unblockVendor: async (
    vendorId: string
  ) => {
    const vendor = await adminRepositary.findVendorById(vendorId);
    if (!vendor) {
      console.error(`Vendor with ID ${vendorId} not found`);
      throw new Error("Vendor not found");
    }

    if (!vendor.isBlocked) {
      console.error(`Vendor with ID ${vendorId} is already unblocked`);
      throw new Error("Vendor is already unblocked");
    }

    return adminRepositary.unblockVendorById(vendorId);
  },

  getAllUsers: async () => {
    return adminRepositary.findAllUsers();
  },

  blockUser: async (userId: string) => {
    const user = await adminRepositary.findUserById(userId); 
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isBlocked) {
      throw new Error("User is already blocked");
    }

    return adminRepositary.blockUserById(userId);
  },

  unblockUser: async (userId: string) => {
    const user = await adminRepositary.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isBlocked) {
      throw new Error("User is already unblocked");
    }

    return adminRepositary.unblockUserById(userId);
  },


  getDashboardData: async () => {
    try {

      const totalEvents = await adminRepositary.getTotalEvents();

      const totalRevenueResult = await adminRepositary.getTotalRevenue();

      const totalRevenue = totalRevenueResult || 0;

      const totalVendors = await adminRepositary.getTotalVendors();

      const totalUsers = await adminRepositary.getTotalUsers();

      return {
        totalEvents,
        totalRevenue,
        totalVendors,
        totalUsers,
      };
    } catch (error: any) {
      console.log("error in admin service: ", error);
    }
  },
}


// loginUser = async (
//   email: string,
//   password: string
// ) => {
//   try {
//     if (process.env.ADMIN_EMAIL !== email) {
//       console.error(Error);
//     }
//     if (process.env.ADMIN_PASS !== password) {
//       console.error(Error);
//     }

//     const adminToken = jwt.sign(
//       {
//         AdminEmail: email,
//       },
//       process.env.JWT_SECRET as string,
//       { expiresIn: "1h" }
//     );

//     return { adminToken, admin: email };
//   } catch (error) {
//     console.error(error);

//   }
// };



// export const getAllVendorsService = async () => {
//   try {
//     return await getAllVendorsFromDB();
//   } catch (error) {
//     console.error(error);
//   }
// };



// export const getAllBookingsService = async () => {
//   try {
//     return await getAllBookingsFromDB();
//   } catch (error) {
//     console.error(error);
//   }
// };



// export const blockVendor = async (
//   vendorId: string
// ) => {
//   const vendor = await findVendorById(vendorId);
//   if (!vendor) {
//     console.error(`Vendor with ID ${vendorId} not found`);
//     throw new Error("Vendor not found");
//   }

//   if (vendor.isBlocked) {
//     console.error(`Vendor with ID ${vendorId} is already blocked`);
//     throw new Error("Vendor is already blocked");
//   }

//   return blockVendorById(vendorId);
// };

// export const unblockVendor = async (
//   vendorId: string
// ) => {
//   const vendor = await findVendorById(vendorId);
//   if (!vendor) {
//     console.error(`Vendor with ID ${vendorId} not found`);
//     throw new Error("Vendor not found");
//   }

//   if (!vendor.isBlocked) {
//     console.error(`Vendor with ID ${vendorId} is already unblocked`);
//     throw new Error("Vendor is already unblocked");
//   }

//   return unblockVendorById(vendorId);
// };



// export const getAllUsers = async () => {
//   return findAllUsers();
// };

// export const blockUser = async (userId: string) => {
//   const user = await findUserById(userId); // Ensure this uses the User model
//   if (!user) {
//     throw new Error("User not found");
//   }

//   if (user.isBlocked) {
//     throw new Error("User is already blocked");
//   }

//   return blockUserById(userId);
// };

// export const unblockUser = async (userId: string) => {
//   const user = await findUserById(userId);
//   if (!user) {
//     throw new Error("User not found");
//   }

//   if (!user.isBlocked) {
//     throw new Error("User is already unblocked");
//   }

//   return unblockUserById(userId);
// };


// export const getDashboardData = async () => {
//   try {

//     const totalEvents = await getTotalEvents();

//     const totalRevenueResult = await getTotalRevenue();

//     const totalRevenue = totalRevenueResult || 0;

//     const totalVendors = await getTotalVendors();

//     const totalUsers = await getTotalUsers();


//     // const [reportStats, revenueLastTwoWeeks] = await Promise.all([
//     //   getReportStats(),
//     //   getRevenueLastTwoWeeks(),
//     // ]);

//     return {
//       // reportStats,
//       // revenueLastTwoWeeks,
//       totalEvents,
//       totalRevenue,
//       totalVendors,
//       totalUsers,
//     };
//   } catch (error: any) {
//     console.log("error in admin service: ", error);
//   }
// };