import express from 'express';
import { AdminController } from '../controller/adminController.js';

const router = express.Router();
const adminController = new AdminController();

// Login route for admin
router.post('/login', (req, res, next) => adminController.adminLogin(req, res, next));

export default router;
