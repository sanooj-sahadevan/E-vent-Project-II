import { loginUser } from '../Service/adminService.js';
export const adminlogin = async (req, res, next) => {
    console.log('admin login');
    const { email, password } = req.body;
    try {
        const result = await loginUser(email, password);
        console.log(result);
        if (result) {
            res.cookie("adminToken", result.adminToken);
            res.json({ adminToken: result.adminToken, admin: result.admin });
        }
        else {
            res.status(401).json({ message: "Login failed" });
        }
    }
    catch (error) {
        next(error);
    }
};
