import { commonAPI } from "./commonAPI";
import { SERVER_URL } from "./serverURL";

import axios from "axios";

const api = axios.create({
  baseURL: `${SERVER_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});
type RequestHeaders = Record<string, string>;

// SignUp API
export const SignUpAPI = async (reqBody: any, reqHeader?: RequestHeaders) => {
  console.log('signup api');
  
  return await commonAPI("POST", `${SERVER_URL}/signup`, reqBody, reqHeader);
};



// export const LoginAPI = async (reqBody: any) => {
//   console.log('LoginAPI - Request Body:', reqBody);
  
//   try {
//     const response = await commonAPI("POST", `${SERVER_URL}/login`, reqBody, { credentials: 'include' });
//     console.log('LoginAPI - Success:', response);
//     return response;
//   } catch (error) {
//     console.error('LoginAPI - Error:', error);
//     throw error;
//   }
// };



// Login API
export const LoginAPI = async (reqBody: any) => {
  console.log('logggg');
  
  // return await commonAPI("POST", `${SERVER_URL}/login`, reqBody, { credentials: 'include' });
  const response =  await axios.post(`${SERVER_URL}/login`, reqBody, {withCredentials: true});
  console.log(response.data);
  
  return response.data;
};

// verfy otp Api
export const verifyOtp = async (data: any) => {
  console.log('poi');
  
let otp =  await api.post("/verifyOtp", data);
console.log(otp);
return otp

};

// Google Api
export const GoogleLoginAPI = async (reqBody: any) => {
  console.log(reqBody);
  
  // return await commonAPI("POST", `${SERVER_URL}/googleLogin`, reqBody);
  const response = await axios.post(`${SERVER_URL}/googleLogin`, reqBody, {withCredentials: true});
  return response.data
};
