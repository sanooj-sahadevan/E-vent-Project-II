import jwt from 'jsonwebtoken';

export class AdminService {
  async loginUser(
    email: string,
    password: string
  ): Promise<{ adminToken: string; admin: string } | null> {
    try {
      if (process.env.ADMIN_EMAIL !== email) {
        throw new Error("User not found");
      }

      if (process.env.ADMIN_PASS !== password) {
        throw new Error("Wrong credentials");
      }

      const adminToken = jwt.sign(
        { AdminEmail: email },
        process.env.JWT_KEY as string,
        { expiresIn: '1h' }
      );

      return { adminToken, admin: email };
    } catch (error:any) {
      throw new Error(error.message || "Login failed");
    }
  }
}
