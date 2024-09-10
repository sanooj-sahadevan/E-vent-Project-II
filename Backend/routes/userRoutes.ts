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
import { DishesController } from "../controller/dishesController.js";
import { DishesService } from "../Service/dishesService.js";

const router = Router();
const loginController = new LoginController();
const dishesService = new DishesService();
const dishesController = new DishesController(dishesService);

router.post("/login", loginController.login.bind(loginController));



// dishes routes

router.post("/adddishes", dishesController.addDishes.bind(dishesController));

export default router;

