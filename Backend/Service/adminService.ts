import jwt from "jsonwebtoken";
import {
  
} from "../Repository/adminRepo";
import { error } from "console";


export const loginUser = async (
    email: string,
    password: string
): Promise<{ adminToken: string; admin: string } | null> => {

    if (process.env.ADMIN_EMAIL !== email) {
        // throw errorHandler(404, "User not found");
        throw error
    }
    if (process.env.ADMIN_PASS !== password) {
        // throw errorHandler(401, "Wrong credentials");
        throw error
    }

    const adminToken = jwt.sign(
        {
            AdminEmail: email,
        },
        process.env.JWT_KEY as string,
        { expiresIn: "1h" }
    );

    return { adminToken, admin: email };
};
