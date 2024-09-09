// import express  from "express";
// import { 
//     googleLoginHandler,
//      login,
//       register,
//        verifyOtp,forgottenPassword,updatePassword } from "../controller/userController.js";
// const router = express.Router();
// router.post("/signup", register);
// router.post("/verifyOtp", verifyOtp);
// router.post("/login", login);
// router.post("/googleLogin", googleLoginHandler); 
// router.post('/forgottenpassword',forgottenPassword)
// router.post('/updatePassword',updatePassword)
// export default router;
import { Router } from "express";
import { LoginController } from "../controller/userController.js";
const router = Router();
const loginController = new LoginController();
router.post("/login", loginController.login.bind(loginController));
export default router;
