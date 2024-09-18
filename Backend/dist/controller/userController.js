import { 
// LoginService,
getAllVendors, 
// googleLogin,
registerUser, verifyAndSaveUser, update, 
// UserService
loginUser, editUser, checkEmail } from "../Service/userService.js";
import { findUserByEmail,
// findUserById,
 } from "../Repository/userReop.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { HttpStatus } from '../utils/httpStatus.js';
export const register = async (req, res, next) => {
    try {
        const { username, email, phone, password } = req.body;
        console.log({ username, email, phone, password });
        const proceedWithRegistration = async () => {
            try {
                const otp = otpGenerator();
                console.log(otp);
                await registerUser({
                    username,
                    phone,
                    email,
                    password, otp,
                    _id: undefined,
                    save: function () {
                        throw new Error("Function not implemented.");
                    },
                    address: "",
                    state: "",
                    pincode: 0,
                    reviews: undefined,
                    district: undefined
                });
                await sendEmail(email, otp);
                res.status(200).json("OTP sent to email");
            }
            catch (error) {
                next(error);
            }
        };
        await proceedWithRegistration();
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await loginUser(email, password);
        // console.log({user, token});
        res.cookie("token", token);
        // console.log('Cookie set:', req.cookies['token']);
        res.status(HttpStatus.OK).json({ user, token });
    }
    catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
};
// export class LoginController {
//   private loginService: LoginService;
//   constructor() {
//     this.loginService = new LoginService();
//   }
//   public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { email, password } = req.body;
//       const { user, token } = await this.loginService.loginUser(email, password);
//       console.log({ user, token });
//       res.cookie("token", token);
//       res.status(200).json({ user, token });
//     } catch (error: any) {
//       next(error);
//     }
//   }
// }
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(email, otp);
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: "User not found" });
        }
        console.log(user.otp, otp);
        if (user.otp === otp) {
            await verifyAndSaveUser(email, otp);
            res.status(HttpStatus.OK).json("User registered successfully");
        }
        else {
            res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
        }
    }
    catch (error) {
        next(Error);
    }
};
function next(Error) {
    throw new Error("Function not implemented.");
}
export const vendorList = async (req, res, next) => {
    try {
        console.log('list');
        const vendors = await getAllVendors();
        res.status(HttpStatus.OK).json(vendors);
    }
    catch (error) {
        next(error);
    }
};
export const forgottenPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const { user } = await checkEmail(email);
        console.log('oooooooooooooooooooooooo');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const otp = otpGenerator();
        console.log('oooooooooooooooooooooooo');
        // await registerUser({ email, otp, username: "", password: "" });
        await sendEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully', otp, email });
        res.status(HttpStatus.OK).json({ message: 'OTP sent successfully', otp, email });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
};
export const updatePassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password + ' main content ithil ind');
        // Update the user's password
        const user = await update(email, password);
        if (!user) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: "User not found" });
            return; // Exit the function after sending the response
        }
        // Respond with the updated user data
        res.status(HttpStatus.OK).json({ message: "Password updated successfully", user });
    }
    catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};
// export class VendorController {
//     private vendorService: VendorService;
//     constructor() {
//         this.vendorService = new VendorService(); // Instantiate service in the constructor
//     }
//     // Fetch all vendors
//     public async getAllVendors(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try {
//             const vendors = await this.vendorService.getAllVendors(); // Call the service method
//             res.status(200).json(vendors); // Return vendors
//         } catch (error) {
//             next(error); // Handle error
//         }
//     }
// }
// export class userController {
//   private vendorService: VendorService;
//   constructor() {
//       this.vendorService = new VendorService(); // Instantiate service in the constructor
//   }
//   // Fetch all vendors
//   public async getAllVendors(req: Request, res: Response, next: NextFunction): Promise<void> {
//       try {
//           const vendors = await this.vendorService.getAllVendors(); // Call the service method
//           res.status(200).json(vendors); // Return vendors
//       } catch (error) {
//           next(error); // Handle error
//       }
//   }
// }
// // import { UserService } from '../Service/userService.js'; // Import the service
export const editUserDetails = async (req, res, next) => {
    try {
        console.log('1');
        console.log('Controller: Edit User Details');
        const userDetails = req.body;
        console.log('Request Body:', userDetails);
        const updatedUser = await editUser(userDetails);
        res.status(HttpStatus.OK).json(updatedUser);
    }
    catch (error) {
        console.error('Error in editUserDetails controller:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' }); // Send an error response
        next(error); // Forward error to the error handler
    }
};
