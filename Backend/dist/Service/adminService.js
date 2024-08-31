import jwt from "jsonwebtoken";
import { error } from "console";
// import { Admin } from "../domain/admin";
// import { errorHandler } from "../uilts/errorHandler"; // Assuming errorHandler is a utility function
export const loginUser = async (email, password) => {
    if (process.env.Admin_email !== email) {
        // throw errorHandler(404, "User not found");
        throw error;
    }
    if (process.env.Admin_pass !== password) {
        // throw errorHandler(401, "Wrong credentials");
        throw error;
    }
    const adminToken = jwt.sign({
        AdminEmail: email,
    }, 'sanoojsanooj', { expiresIn: "1h" });
    return { adminToken, admin: email };
};
