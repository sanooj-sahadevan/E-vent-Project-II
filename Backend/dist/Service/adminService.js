import jwt from "jsonwebtoken";
import { error } from "console";
// import { Admin } from "../domain/admin";
// import { errorHandler } from "../uilts/errorHandler"; // Assuming errorHandler is a utility function
export const loginUser = async (email, password) => {
    if ('sanu007@gmail.com' !== email) {
        // throw errorHandler(404, "User not found");
        throw error;
    }
    if ('Babygirl@123' !== password) {
        // throw errorHandler(401, "Wrong credentials");
        throw error;
    }
    const adminToken = jwt.sign({
        AdminEmail: email,
    }, 'sanoojsanooj', { expiresIn: "1h" });
    return { adminToken, admin: email };
};
