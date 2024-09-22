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
  const response = await axios.post(`${SERVER_URL}/login`, reqBody, { withCredentials: true });
  console.log(response.data);

  return response.data;
};

// verfy otp Api
export const verifyOtp = async (data: any) => {
  console.log('poi');

  let otp = await api.post("/verifyOtp", data);
  console.log(otp);
  return otp

};

// Google Api
export const GoogleLoginAPI = async (reqBody: any) => {
  console.log(reqBody);

  // return await commonAPI("POST", `${SERVER_URL}/googleLogin`, reqBody);
  const response = await axios.post(`${SERVER_URL}/googleLogin`, reqBody, { withCredentials: true });
  return response.data
};

export const ForgotenAPI = async (reqBody: any) => {
  console.log('logggg');

  // return await commonAPI("POST", `${SERVER_URL}/login`, reqBody, { credentials: 'include' });
  const response = await axios.post(`${SERVER_URL}/forgottenpassword`, reqBody, { withCredentials: true });
  console.log('vann');

  console.log(response.data, 'dataaaaa');

  return response.data;

}

export const forgottenverifyOtp = async (data: any) => {
  console.log('poi');

  let otp = await api.post("/forgottenverifyOtp", data);
  console.log(otp);
  return otp

};


export const updatePassword = async (data: any) => {
  console.log('poi');

  let response = await api.post("/updatePassword", data);
  console.log(response);
  return response

};


export const allVendorAPI = async () => {
  try {
    console.log('sucess front end ');

    const response = await axios.get(`${SERVER_URL}/vendors`);
    console.log(response.data,'basdhbqhbd')
    return response.data;
  } catch (error) {
    console.error(error);

  }

};


export const UserEdit = async (vendorData: any) => {
  try {
    console.log('Editing user details -------------------------------', vendorData);

    // Make the API call to update the user
    return await axios.patch(`${SERVER_URL}/edituserDetails`, vendorData, {
      headers: {
        'Content-Type': 'application/json', // Ensure JSON data is being sent
      },
      withCredentials: true, // If you're using cookies or authentication
    });
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
};







export const allDishesAPI = async () => {
  try {
    console.log('sucess front end ');

    const response = await axios.get(`${SERVER_URL}/dishlist`);
    console.log(response.data,'basdhbqhbd')
    return response.data;
  } catch (error) {
    console.error(error);

  }

};



export const allAuditoriumAPI = async (vendorId: string) => {
  try {
      console.log('Success front end');

      const response = await axios.get(`${SERVER_URL}/auditoriumlist?vendorId=${vendorId}`); // Send vendorId as a query parameter
      console.log(response.data, 'basdhbqhbd');
      return response.data;
  } catch (error) {
      console.error(error);
  }
};


export const fetchvendor = async (vendorId: string) => { //  fecth vendor profile in userside 
  try {
    console.log('rdyyyyy');
    
      const res = await axios.get(`${SERVER_URL}/fetchVendorDetails/${vendorId}`);
      console.log(res);
      return res;
  } catch (error) {
    console.error(error);
    
  }
};


export const FetchDishes = async (vendorId: string) => {
  try {

    console.log('pokunnu food');
    
    const res = await axios.get(`${SERVER_URL}/fetchFoodDetails/${vendorId}`);
    return res.data; // Return data directly for easier usage in the component
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    throw new Error('Failed to fetch vendor details');
  }
};