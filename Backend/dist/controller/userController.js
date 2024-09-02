import { loginUser, googleLogin, registerUser, verifyAndSaveUser, } from "../Service/userService.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { findUserByEmail } from "../Repository/userReop.js";
export const register = async (req, res) => {
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
                res.status(200).json("OTP sent to email");
            }
            catch (error) {
                res.status(400).json({ error: `Registration failed: ${error.message}` });
            }
        };
        await proceedWithRegistration();
    }
    catch (error) {
        res.status(400).json({ error: `Error: ${error.message}` });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await loginUser(email, password);
        console.log({ user, token });
        res.cookie("token", token);
        // console.log('Cookie set:', req.cookies['token']);
        res.status(200).json({ user, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(email, otp);
        const user = await findUserByEmail(email);
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log(user.otp, otp);
        if (user.otp === otp) {
            await verifyAndSaveUser(email, otp);
            res.status(200).json("User registered successfully");
        }
        else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
};
export const googleLoginHandler = async (req, res) => {
    try {
        const { email, username, profileImage, phone } = req.body;
        console.log("from req.body: " + email, username, phone);
        googleLogin({
            email,
            username,
            phone,
        })
            .then((loginResult) => {
            res.cookie("token", loginResult.token);
            res.status(200).json(loginResult);
        })
            .catch((error) => {
            res.status(500).json({ error: "Failed to handle Google login" });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process Google login" });
    }
};
