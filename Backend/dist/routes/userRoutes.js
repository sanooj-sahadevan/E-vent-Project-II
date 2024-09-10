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
import { VendorController } from "../controller/userController.js"; // Import the controller
const router = Router();
const loginController = new LoginController();
const vendorController = new VendorController(); // Instantiate the controller
router.post("/login", loginController.login.bind(loginController));
router.get("/vendors", vendorController.getAllVendors.bind(vendorController)); // Bind the controller method to the route
export default router;
// dishes routes
