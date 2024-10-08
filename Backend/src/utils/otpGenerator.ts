import crypto from 'crypto';
export const otpGenerator = () => {
  return crypto.randomInt(1000, 9999).toString();
};