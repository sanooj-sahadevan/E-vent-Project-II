import { Request, Response } from "express";
import { loginUser, googleLogin, registerUser, verifyAndSaveUser, update,checkEmail} from "../Service/userService.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { findUserByEmail } from "../Repository/userReop.js";
import { HttpStatus } from "../utils/httpStatus.js";

export const register = async (req: Request, res: Response) => {
  try {

    console.log('controller');

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
          password, otp
        });
        await sendEmail(email, otp);


        res.status(HttpStatus.OK).json("OTP sent to email");
      } catch (error: any) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: `Registration failed: ${error.message}` });
      }
    };

    await proceedWithRegistration();
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: `Error: ${error.message}` });
  }
};


export const login = async (req: Request, res: Response) => {
  try {

    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    console.log({ user, token });

    res.cookie("token", token);
    // console.log('Cookie set:', req.cookies['token']);
    res.status(HttpStatus.OK).json({ user, token });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};



export const verifyOtp = async (req: Request, res: Response) => {
  try {

    const { email, otp } = req.body;
    console.log(email, otp);

    const user = await findUserByEmail(email);
    console.log(user);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: "User not found" });
    }
    console.log(user.otp, otp);

    if (user.otp === otp) {
      await verifyAndSaveUser(email, otp);
      res.status(HttpStatus.OK).json("User registered successfully");
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
    }
  } catch (error: any) {
    console.log(error.message);

    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};


export const googleLoginHandler = async (req: Request, res: Response) => {
  try {
    const { email, username, profileImage, phone } = req.body;
    console.log("from req.body: " + email, username, phone);

    googleLogin({
      email,
      username,
      phone,
    })
      .then((loginResult) => {
        res.cookie("token", loginResult.token)
        res.status(HttpStatus.OK).json(loginResult);
      })
      .catch((error: any) => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to handle Google login" });
      });
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to process Google login" });
  }
};

export const forgottenPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body; 
    const { user } = await checkEmail(email); 

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found' });
    }

    const otp = otpGenerator(); 
    console.log(`Generated OTP: ${otp}`); // This will log the OTP to the console

    // await registerUser({ email, otp, username: "", password: "" });
    await sendEmail(email, otp);

    res.status(HttpStatus.OK).json({ message: 'OTP sent successfully' ,otp,email});
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};




export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; // Get email and password from the request body
console.log(email, password+'main content ithil ind');

    // Update the user's password
    const user = await update(email, password);

    if (!user) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: "User not found" });
    }

    // Respond with the updated user data
    res.status(HttpStatus.OK).json({ message: "Password updated successfully", user });
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};
