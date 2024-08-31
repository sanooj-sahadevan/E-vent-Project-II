import express  from "express";
import { adminlogin,
    //  getCompanyUnapproval,
    //   updateCompanyApproval
     } 
      from "../controller/adminController.js";
// import adminJwtMiddleware from "../MiddleWare/adminJWT";


const router = express.Router();

// Login route for admin
router.post("/login", adminlogin);

// company approval route
// router.get("/approval", adminJwtMiddleware, getCompanyUnapproval);

// router.put("/approval/:id", adminJwtMiddleware, updateCompanyApproval);



export default router;