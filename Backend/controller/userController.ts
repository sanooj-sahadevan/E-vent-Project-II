import { NextFunction, Request, Response } from "express";
import {
  LoginService,
  VendorService,
  //  googleLogin,
  // registerUser,
  //  verifyAndSaveUser,
  update,
  // checkEmail
} from "../Service/userService.js";
// import { otpGenerator } from "../utils/otpGenerator.js";
// import { sendEmail } from "../utils/sendEmail.js";
import { HttpStatus } from '../utils/httpStatus.js'



// export const register = async (req: Request, res: Response,next:NextFunction) => {
//   try {
//     const { username, email, phone, password } = req.body;
//     console.log({ username, email, phone, password });




//     const proceedWithRegistration = async () => {
//       try {
//         const otp = otpGenerator();
//         console.log(otp);
//         await registerUser({
//           username,
//           phone,
//           email,
//           password, otp
//         });
//         await sendEmail(email, otp);


//         res.status(200).json("OTP sent to email");
//       } catch (error: any) {
//         next(error); 
//            }
//     };

//     await proceedWithRegistration();
//   } catch (error: any) {
//     next(error);   }
// };




export class LoginController {
  private loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.loginService.loginUser(email, password);
      console.log({ user, token });

      res.cookie("token", token);
      res.status(200).json({ user, token });
    } catch (error: any) {
      next(error);
    }
  }
}





// export const verifyOtp =  async (req: Request, res: Response,next:NextFunction) => {
//   try {

//     const { email, otp } = req.body;
//     console.log(email, otp);



//     next(error);   }
// };



// export const forgottenPassword = async (req: Request, res: Response,next:NextFunction) => {
//   try {
//     const { email } = req.body; 
//     const { user } = await checkEmail(email); 
// console.log('oooooooooooooooooooooooo');

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }



//     // await registerUser({ email, otp, username: "", password: "" });
//     await sendEmail(email, otp);

//     res.status(200).json({ message: 'OTP sent successfully' ,otp,email});
//   } catch (error: any) {
//     next(error);   }
// };



export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log(email, password + ' main content ithil ind');

    // Update the user's password
    const user = await update(email, password);

    if (!user) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: "User not found" });
      return;  // Exit the function after sending the response
    }

    // Respond with the updated user data
    res.status(HttpStatus.OK).json({ message: "Password updated successfully", user });
  } catch (error: any) {
    next(error); // Pass the error to the error-handling middleware
  }
};





export class VendorController {
    private vendorService: VendorService;

    constructor() {
        this.vendorService = new VendorService(); // Instantiate service in the constructor
    }

    // Fetch all vendors
    public async getAllVendors(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const vendors = await this.vendorService.getAllVendors(); // Call the service method
            res.status(200).json(vendors); // Return vendors
        } catch (error) {
            next(error); // Handle error
        }
    }
}
