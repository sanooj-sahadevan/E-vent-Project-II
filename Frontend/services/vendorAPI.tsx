import { commonAPI } from "./commonAPI";
import { SERVER_URL_vendor } from "./serverURL";

import axios, { AxiosResponse } from "axios";

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

  const response = await axios.post(`${SERVER_URL_vendor}/login`, reqBody, { withCredentials: true });
  return response.data
};

// verfy otp Api
export const verifyOtp = async (data: any) => {
  console.log("comming: " + data);

  return api.post("/verifyOtp", data);
};


export const addDishAPI = async (data: any) => {
  try {
    console.log('api dishe-------------------------s');
    
    console.log('addDishApi');
    return await axios.post(`${SERVER_URL_vendor}/addDishes`, data, { withCredentials: true });
  } catch (error) {
    console.error('error');

  }
}



export const addAuditoriumAPI = async (data: any) => {
  try {
    console.log('addAuditorium');
    return await axios.post(`${SERVER_URL_vendor}/addAuditorium`, data, { withCredentials: true });
  } catch (error) {
    console.error('error');

  }
}

export const vendorDetails = async (): Promise<AxiosResponse<any>> => {
  try {
    console.log('Fetching vendor details');
    return await axios.get(`${SERVER_URL_vendor}/getAddress`);
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    throw error; // Rethrow the error to handle it in the component
  }
}



export const editDetails = async (vendorData: any) => {
  try {
    console.log('Editing vendor details');
    // Use PUT or POST depending on the API
    return await axios.put(`${SERVER_URL_vendor}/editVendor`, vendorData);
  } catch (error) {
    console.error('Error updating vendor details:', error);
    throw error;
  }
};

export const VendorEdit = async (vendorData: any) => {

  try {
    console.log('Editing vendor details -------------------------------');
    // Use PUT or POST depending on the API
    return await axios.patch(`${SERVER_URL_vendor}/editVendorDetails`, vendorData);

  } catch (error) {
    console.error('Error updating vendor details:', error);
    throw error;
  }


}

export const fetchvendor = async (vendorId: string) => {
  try {
    console.log('rdyyyyy');
    
      const res = await axios.get(`${SERVER_URL_vendor}/fetchVendorDetails/${vendorId}`);
      console.log(res);
      return res;
  } catch (error) {
    console.error(error);
    
  }
};




export const fetchdishes = async (dishesId: string) => {
  try {
    console.log('rdyyyyy');
    
      const res = await axios.get(`${SERVER_URL_vendor}/fetchdishes/${dishesId}`);
      console.log(res);
      return res;
  } catch (error) {
    console.error(error);
    
  }
};


export const fetchDetailsVendor = async (vendorId: string) => {
  try {

    console.log('pokunnu  detils ');
    
    const res = await axios.get(`${SERVER_URL_vendor}/fetchDetailsVendor/${vendorId}`);
    return res.data; // Return data directly for easier usage in the component
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    throw new Error('Failed to fetch vendor details');
  }
};




export const FetchDishes = async (vendorId: string) => {
  try {

    console.log('pokunnu food');
    
    const res = await axios.get(`${SERVER_URL_vendor}/fetchFoodDetails/${vendorId}`);
    return res.data; // Return data directly for easier usage in the component
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    throw new Error('Failed to fetch vendor details');
  }
};



export const FetchAuditorium = async (vendorId: string) => {
  try {

    console.log('pokunnu hall');
    
    const res = await axios.get(`${SERVER_URL_vendor}/fetchAuditoriumDetails/${vendorId}`);
    return res.data; // Return data directly for easier usage in the component
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    throw new Error('Failed to fetch vendor details');
  }
};



export const fetchauditorium = async (auditoriumId: string) => {
  try {
    console.log('rdyyyy auditirum profie');
    
      const res = await axios.get(`${SERVER_URL_vendor}/fetchauditorium/${auditoriumId}`);
      console.log(res);
      return res;
  } catch (error) {
    console.error(error);
    
  }
};