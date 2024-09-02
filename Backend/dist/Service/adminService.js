import jwt from "jsonwebtoken";
import { error } from "console";
export const loginUser = async (email, password) => {
    if (process.env.ADMIN_EMAIL !== email) {
        // throw errorHandler(404, "User not found");
        throw error;
    }
    if (process.env.ADMIN_PASS !== password) {
        // throw errorHandler(401, "Wrong credentials");
        throw error;
    }
    const adminToken = jwt.sign({
        AdminEmail: email,
    }, process.env.JWT_KEY, { expiresIn: "1h" });
    return { adminToken, admin: email };
};
