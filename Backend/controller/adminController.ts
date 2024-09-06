import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../Service/adminService.js';
import { HttpStatus } from '../utils/httpStatus.js';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;
    
    try {
      const result = await this.adminService.loginUser(email, password);

      if (result) {
        res.cookie('adminToken', result.adminToken, { httpOnly: true });
        res.status(HttpStatus.OK).json({ adminToken: result.adminToken, admin: result.admin });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Login failed' });
      }
    } catch (error) {
      next(error);
    }
  }
}
