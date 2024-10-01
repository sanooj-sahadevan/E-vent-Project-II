import { Request, Response, NextFunction } from 'express';
import { loginUser } from '../Service/adminService.js';
import { HttpStatus } from '../utils/httpStatus.js';


export const adminlogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  console.log('admin login');
  
  const { email, password } = req.body;
  try {
    const result = await loginUser(email, password);
    console.log(result);

    if (result) {
      res.cookie("adminToken", result.adminToken);
      res.json({ adminToken: result.adminToken, admin: result.admin });
    } else {
      res.status(401).json({ message: "Login failed" });
    }
  } catch (error) {
    next(error);
  }
};