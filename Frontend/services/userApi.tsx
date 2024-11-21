import { commonAPI } from "./commonAPI";
import { SERVER_URL } from "./serverURL";

import axios from "axios";

const api = axios.create({
  baseURL: `${SERVER_URL}`,
  headers: {
    "Content-Type": "application/json",
  }, withCredentials: true 
});
type RequestHeaders = Record<string, string>;
export const SignUpAPI = async (reqBody: any, reqHeader?: RequestHeaders) => {
  console.log('signup api');

  return await commonAPI("POST", `${SERVER_URL}/signup`, reqBody, reqHeader);
};






// Login API
export const LoginAPI = async (reqBody: any) => {
  try {
    const response = await axios.post(`${SERVER_URL}/login`, reqBody);
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    // }
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error
  }
};


export const verifyOtp = async (data: any) => {
  try {
    let otp = await api.post("/verifyOtp", data);
    console.log(otp);
    return otp
  } catch (error) {
    throw error

  }

};

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
    console.log(response.data, 'basdhbqhbd')
    return response.data;
  } catch (error) {
    console.error(error);

  }

};

export const UserEdit = async (vendorData: any) => {
  try {
    console.log('Sending user edit request:', vendorData);
    const response = await axios.patch(`${SERVER_URL}/edituserDetails`, vendorData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    console.log('User edit successful:', response.data);
    return response;
  } catch (error) {
    console.error('Error in UserEdit function:', error);
    throw error;
  }
};







export const allDishesAPI = async (vendorId: string) => {
  try {
    console.log('sucess front end ');

    const response = await axios.get(`${SERVER_URL}/dishlist?vendorId=${vendorId}`); // Send vendorId as a query parameter
    console.log(response.data, 'basdhbqhbd')
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

    // console.log(vendor, chatId, 'Received vendor and chat ID');

    return { vendor, chatId };
  } catch (error) {
    console.error("Error fetching vendor:", error);
    throw error;
  }
};



export const fetchReview = async (vendorId: string, userId: string) => {
  try {
    const res = await axios.get(`${SERVER_URL}/fetchReview?vendorId=${vendorId}&userId=${userId}`);
    console.log(res.data);
  
    return res.data;
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
};



export const saveRatings = async (vendorId: string,) => {
  try {

    const res = await axios.post(`${SERVER_URL}/saveRatings`)


    return res.data;
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
};




export const FetchDishes = async (vendorId: string) => {
  try {
    const res = await axios.get(`${SERVER_URL}/fetchFoodDetails/${vendorId}`);
    return res.data;
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

    const response = await axios.get(`${SERVER_URL}/bookEvent/${bookingId}`, { withCredentials: true }); // Adjust the API endpoint
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
    console.log(response.data, 'api call retuen');

    return response.data;
  } catch (error) {
    console.error('Error fetching booking data:', error);
    throw error;
  }
};









export const changePassword = async (email: string, newPassword: string | undefined) => {
  try {
    console.log('Changing password for:', email);
    const response = await axios.patch(`${SERVER_URL}/changePassword/${email}`, { newPassword });
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const savePassword = async (email: string, newPassword: string | undefined) => {
  try {
    console.log('Saving password for:', email,newPassword);
    const response = await axios.patch(`${SERVER_URL}/savePassword/${email}`, { newPassword });
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};



export const userGetUnreadMessagesCountAPI = async (userId: string) => {
  try {
    console.log('Fetching unread messages count for user:', userId);

    const response = await axios.get(`${SERVER_URL}/userunread-count`, {
      params: { userId }, // pass the userId as a query parameter
      withCredentials: true
    });

    console.log('Unread messages response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread messages:', error);
  }
};


export const saveReview = async (review: string, rating: number, userId: string, vendorId: string) => {
  try {
    console.log(review,
      rating,
      userId,
      vendorId, '---------------------------');

    const response = await axios.post(`${SERVER_URL}/review`, {
      reviews: review,
      stars: rating,
      userId,
      vendorId,
    }, {
      withCredentials: true
    });

    return response.data;
  } catch (error) {
    console.error('Error saving review:', error);
    throw error;
  }
};



export const fetchNotification = async (userId: string) => {
  try {
    const response = await axios.get(`${SERVER_URL}/fetchNotifications`, {
      params: { userId },
      withCredentials: true,
    });
    console.log('Unread messages response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    throw error;
  }
};


export const fetchSlots = async (vendorId: string) => {
  try {
    const response = await axios.get(`${SERVER_URL}/slots/${vendorId}`, {
      withCredentials: true,
    });
    console.log('Slot response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching slots:', error);
    throw error;
  }
};


export const searchUsers = async (term: string) => {
  try {

    const response = await axios.get(`${SERVER_URL}/searchUsers?term=${term}`);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error(error);

  }

};



export const logoutApi = async () => {
  try {
    const response = await axios.post(`${SERVER_URL}/logout`, {
      withCredentials: true,
    });
    console.log("response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching logout API:", error);
    throw error;
  }
};



