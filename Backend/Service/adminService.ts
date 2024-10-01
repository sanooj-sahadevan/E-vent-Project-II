import jwt from 'jsonwebtoken';


export const loginUser = async (
  email: string,
  password: string
): Promise<{ adminToken: string; admin: string } | null> => {
  if (process.env.ADMIN_EMAIL !== email) {
console.error(Error);
  }
  if (process.env.ADMIN_PASS !== password) {
    console.error(Error);
  }

  const adminToken = jwt.sign(
    {
      AdminEmail: email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return { adminToken, admin: email };
};