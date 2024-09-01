import { 
//   getAllUnapprovalCompany,
loginUser,
//   updateApproval,
 } from "../Service/adminService.js";
export const adminlogin = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const result = await loginUser(email, password);
        console.log(result, 'sucess');
        if (result) {
            console.log(result + 'sucess');
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
