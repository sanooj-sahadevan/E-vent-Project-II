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

  const response = await axios.post(`${SERVER_URL}/googleLogin`, reqBody, { withCredentials: true });
  return response.data
};

export const ForgotenAPI = async (reqBody: any) => {
  console.log('logggg');

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







export const allDishesAPI =  async (vendorId: string) => {
  try {
    console.log('sucess front end ');

    const response = await axios.get(`${SERVER_URL}/dishlist?vendorId=${vendorId}`); // Send vendorId as a query parameter
    console.log(response.data,'basdhbqhbd')
    return response.data;
  } catch (error) {
    console.error(error);

  }

};

export const allAuditoriumAPI = async (vendorId: string) => {
  try {
      console.log('Success front end');

      const response = await axios.get(`${SERVER_URL}/auditoriumlist?vendorId=${vendorId}`); 
      console.log(response.data, 'basdhbqhbd');
      return response.data;
  } catch (error) {
      console.error(error);
  }
};



export const fetchvendor = async (vendorId: string, userId: string) => {
  try {
    const res = await axios.get(`${SERVER_URL}/fetchVendorDetails?vendorId=${vendorId}&userId=${userId}`);
    
    const { vendor, chatId } = res.data;  
    
    console.log(vendor, chatId, 'Received vendor and chat ID');
    
    return { vendor, chatId };  
  } catch (error) {
    console.error("Error fetching vendor:", error);
    throw error;
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


export const FetchAuditorium = async (vendorId: string) => {
  try {

    console.log('pokunnu Ausittttttttttttttttttt');
    
    const res = await axios.get(`${SERVER_URL}/fetchAuditoriumDetails/${vendorId}`);
    return res.data; // Return data directly for easier usage in the component
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    throw new Error('Failed to fetch vendor details');
  }
};




export const Payment = async (username: string) => {
  try {

    console.log('payment on');
    
    const res = await axios.get(`${SERVER_URL}/Payment/${username}`);
    return res.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Failed to process payment');
  }
};


// alone dishs

export const fetchdishes = async (auditoriumId: string) => {
  try {
    console.log('rdyyyy auditirum profie');
    
      const res = await axios.get(`${SERVER_URL}/fetchdishes/${auditoriumId}`);
      console.log(res);
      return res;
  } catch (error) {
    console.error(error);
    
  }
};


export const fetchauditorium = async (auditoriumId: string) => {
  try {
    console.log('rdyyyy auditirum profie');
    
      const res = await axios.get(`${SERVER_URL}/fetchauditorium/${auditoriumId}`);
      console.log(res);
      return res;
  } catch (error) {
    console.error(error);
    
  }
};




export const saveDB = async (bookingDetails: Object) => {
  try {
    console.log('Saving to database...');

    const res = await axios.post(`${SERVER_URL}/saveDB`, bookingDetails); // Use POST and send the object in the body
    console.log(res.data);
    return res.data; // Return the response data
  } catch (error) {
    console.error('Error saving to database:', error);
    throw error; // Optionally rethrow the error for handling in the caller
  }
};


export const fetchBookedData = async (bookingId: any) => {
  try {

    console.log('32423453525');
    
    const response = await axios.get(`${SERVER_URL}/bookEvent/${bookingId}`, { withCredentials: true}); // Adjust the API endpoint
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching booking data:", error);
    throw error;
  }
};




// Fetch booking details by userId
export const fetchBookingDetilsProfile = async (userId: string) => {
  try {
    const response = await axios.get(`${SERVER_URL}/fetchBookingDetails/${userId}`);
    console.log(response.data);
    
    return response.data; 
  } catch (error) {
    console.error('Error fetching booking data:', error);
    throw error;
  }
};





