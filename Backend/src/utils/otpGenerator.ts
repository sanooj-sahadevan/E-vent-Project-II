import crypto from 'crypto';
export const otpGenerator = () => {

  let otp =  crypto.randomInt(1000, 9999).toString();
  console.log(otp,'--');
  return otp
  
};