export interface User {
  save(): unknown; 
  username: string;
  phone?: number;
  email: string;
  password?: string;
  profileImage?: string;
  otp?: string;
  otpVerified?: boolean;
  address?: string;
  state?: string;
  district?: string;
  pincode?: number;
  reviews?: string[];
  isBlocked?: boolean;
  latitude: number; 
  longitude: number; 
}
