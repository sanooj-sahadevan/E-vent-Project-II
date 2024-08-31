import crypto from 'crypto';


// Function to generate an OTP
export const otpGenerator = () => {
  return crypto.randomInt(1000, 9999).toString(); // Generates a 6-digit OTP
};