import express from 'express';
import { adminlogin } from '../controller/adminController.js';
const router = express.Router();
// Login route for admin
router.post("/login", adminlogin);
export default router;
