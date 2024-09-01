import { commonAPI } from "./commonAPI";
import { SERVER_URL_vendor } from "./serverURL";

import axios from "axios";

const api = axios.create({
  baseURL: `${SERVER_URL_vendor}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// SignUp API
export const SignUpAPI = async (
  reqBody: any,
  reqHeader: { "Content-Type": string } | undefined
) => {
  console.log('vendor Signup');

  return await commonAPI("POST", `${SERVER_URL_vendor}/signup`, reqBody, reqHeader);
};

// Login API
export const LoginAPI = async (reqBody: any) => {
  // return await commonAPI("POST", `${SERVER_URL_COMPANY}/login`, reqBody);
  console.log('vendor login');
  
  const response = await axios.post(`${SERVER_URL_vendor}/login`, reqBody, {withCredentials: true});
  return response.data
};

// verfy otp Api
export const verifyOtp = async (data: any) => {
  console.log("comming: " + data);
  
  return api.post("/verifyOtp", data);
};


// export const addTripAPI = async (data: any) => {
//   return await axios.post(`${SERVER_URL_vendor}/addTrip`, data, {withCredentials: true});
// }

// export const getAllTripsAPI = async () => {
//   const response =  await axios.get(`${SERVER_URL_vendor}/trips`, {withCredentials: true});
//   return response.data;
// }