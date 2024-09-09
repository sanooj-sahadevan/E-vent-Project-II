import jwt from 'jsonwebtoken';
export class AdminService {
    async loginUser(email, password) {
        try {
            if (process.env.ADMIN_EMAIL !== email) {
                throw new Error("User not found");
            }
            if (process.env.ADMIN_PASS !== password) {
                throw new Error("Wrong credentials");
            }
            const adminToken = jwt.sign({ AdminEmail: email }, process.env.JWT_KEY, { expiresIn: '1h' });
            return { adminToken, admin: email };
        }
        catch (error) {
            throw new Error(error.message || "Login failed");
        }
    }
}
