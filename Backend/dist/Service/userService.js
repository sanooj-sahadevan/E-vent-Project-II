import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail, updateUser, } from "../Repository/userReop.js";
export const registerUser = async (user) => {
    try {
        console.log('service');
        const existingUser = await findUserByEmail(user.email);
        if (existingUser) {
            if (existingUser.otpVerified) {
                throw new Error("User already exists");
            }
            else {
                await updateUser(existingUser.email, user);
                return existingUser;
            }
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        return await createUser(user);
    }
    catch (error) {
        console.error("Error during user registration:", error);
        throw new Error(`Registration error: ${error.message}`);
    }
};
export const loginUser = async (email, password) => {
    console.log('log in');
    const user = await findUserByEmail(email);
    console.log(user);
    if (!user) {
        throw new Error("Invalid Email/Password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid Email/Password");
    }
    console.log('jwt');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
        expiresIn: "1h",
    });
    return { user, token };
};
export const verifyAndSaveUser = async (email, otp) => {
    const user = await findUserByEmail(email);
    if (user && user.otp === otp) {
        user.otp = undefined;
        user.otpVerified = true;
        await user.save();
        return user;
    }
    throw new Error("Invalid OTP");
};
export const googleLogin = async ({ email, profileImagePath, username, phone, }) => {
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            const token = jwt.sign({ userId: existingUser._id }, 'sanoojsanooj', { expiresIn: "1h" });
            return { user: existingUser, token };
        }
        else {
            const newUser = {
                username,
                email,
                password: "defaultPassword",
                profileImage: profileImagePath || "",
                phone: phone || undefined,
                otpVerified: true,
            };
            // const hashedPassword = await bcrypt.hash(newUser.password, 10);
            // newUser.password = hashedPassword;
            const createdUser = await createUser(newUser);
            const token = jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
            return { user: createdUser, token };
        }
    }
    catch (error) {
        console.error("Error during Google login:", error);
        throw new Error("Failed to handle Google login");
    }
};
