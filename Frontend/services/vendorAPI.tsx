import { commonAPI } from "./commonAPI";
import { SERVER_URL, SERVER_URL_vendor } from "./serverURL";
import { server_URL_chat } from "./serverURL";


import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: `${SERVER_URL_vendor}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const SignUpAPI = async (
  reqBody: any,
  reqHeader: { "Content-Type": string } | undefined
) => {
  console.log('vendor Signup');

  return await commonAPI("POST", `${SERVER_URL_vendor}/signup`, reqBody, reqHeader);
};

export const LoginAPI = async (reqBody: any) => {
  console.log('vendor login');
  const response = await axios.post(`${SERVER_URL_vendor}/login`, reqBody, { withCredentials: true });
  return response.data
};

export const verifyOtp = async (data: any) => {
  console.log("comming: " + data);
  return api.post("/verifyOtp", data);
};


export const addDishAPI = async (data: any) => {
  try {
    const formData = new FormData();
    console.log('hey hey hey----dish');

    for (const key in data) {
      formData.append(key, data[key]);
    }
    const res = await axios.post(`${SERVER_URL_vendor}/addDishes`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error('Error in addDishAPI:', error);
  }
};



export const getPresignedUrl = async (fileName: string, fileType: string) => {
  try {
    console.log("Fetching pre-signed URL");
    const response = await axios.get(`${SERVER_URL_vendor}/getPresignedUrl`, {
      params: { fileName, fileType },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pre-signed URL:", error);
    throw error;
  }
};



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
    throw error;
  }
}



export const editDetails = async (vendorData: any) => {
  try {
    console.log('Editing vendor details');
    return await axios.put(`${SERVER_URL_vendor}/editVendor`, vendorData);
  } catch (error) {
    console.error('Error updating vendor details:', error);
    throw error;
  }
};

export const VendorEdit = async (data: any) => {

  try {
    return await axios.patch(`${SERVER_URL_vendor}/editVendorDetails`, data, { withCredentials: true });
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


export const fetchReviews = async (vendorId: string) => {
  try {

    console.log('pokunnu review');

    const res = await axios.get(`${SERVER_URL_vendor}/fetchReviews/${vendorId}`);
    console.log(res, '0---------k');

    return res.data;
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



export const deleteDish = async (dishId: string,) => {
  try {
    console.log('Attempting to delete dish');
    const response = await axios.patch(`${SERVER_URL_vendor}/dishes/${dishId}`, {
      isDeleted: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw new Error('Failed to delete dish');
  }
};


export const deleteAuditorium = async (aditoriumId: string,) => {
  try {
    console.log('Attempting to delete dish');
    const response = await axios.patch(`${SERVER_URL_vendor}/auditorium/${aditoriumId}`, {
      isDeleted: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw new Error('Failed to delete dish');
  }
};


export const approveReviewAPI = async (reviewId: string,) => {
  try {
    const response = await axios.patch(`${SERVER_URL_vendor}/approveReview/${reviewId}`, {
      vendorVerified: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw new Error('Failed to delete dish');
  }
};

export const rejectReviewAPI = async (reviewId: string,) => {
  try {
    console.log('Attempting to delete dish');
    const response = await axios.delete(`${SERVER_URL_vendor}/rejectReview/${reviewId}`,);
    return response.data;
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw new Error('Failed to delete dish');
  }
};















export const vendorChats = (id: string) => {
  return axios.get(`${server_URL_chat}/company/${id}`);
};




export const SaveChat = async (reqBody: { text: string; senderId: string | null; vendorId: string | null }) => {
  try {
    console.log('Sending request to save chat:', reqBody); // Debugging line
    const response = await axios.post(`${server_URL_chat}/savechat`, reqBody, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving chat:", error);
    throw error;
  }
};


export const getMessages = (id: string) => {
  try {
    console.log(id, 'pp');

    console.log('okkkkkkkkkkkkkkkkkkkkokkkkkkkkkkkkkkkkkkkk');

    return axios.get(`${server_URL_chat}/message/${id}`);
  } catch (error: any) {
    console.log(error);
  }
};


export const getUnreadMessagesCountAPI = async () => {
  try {
    const response = await axios.get(`${SERVER_URL_vendor}/unread-count`, { withCredentials: true });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);

  }
};






export const messageSend = async (reqBody: { text: string; senderId: string | null; userId: string | null }) => {
  try {
    const response = await axios.post(`${server_URL_chat}/message`, reqBody, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};








export const vendorBookingDetils = async (vendorId: string) => {
  try {
    const response = await axios.get(`${SERVER_URL_vendor}/vendorBookingDetils/${vendorId}`);
    console.log(response.data, 'api call retuen');

    return response.data;
  } catch (error) {
    console.error('Error fetching booking data:', error);
    throw error;
  }
};



export const createSlotAPI = async (reqBody: { startDate: Date, endDate: Date }, vendorId: string) => {
  try {
    const response = await axios.post(`${SERVER_URL_vendor}/create-slot/${vendorId}`, reqBody);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create slot");
  }
};


export const getSlotsByWorkerAPI = async (vendorId: string) => {
  try {
    const response = await axios.get(`${SERVER_URL_vendor}/slots/${vendorId}`);
    console.log(response.data, 'API call return');

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch slots by worker");
  }
}

export const savePhotoUrlsToDB = async (photoUrls: string[], vendorId: string) => {
  try {
    console.log('hyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');

    const response = await axios.post(`${SERVER_URL_vendor}/serviceImage/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        photoUrls,
        vendorId,
      },
    });

    return response;
  } catch (error) {
    console.error("Error while saving photo URLs and vendorId to DB:", error);
    throw error;
  }
};