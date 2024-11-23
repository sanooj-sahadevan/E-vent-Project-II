import { commonAPI } from "./commonAPI";
import { SERVER_URL, SERVER_URL_vendor } from "./serverURL";
import { server_URL_chat } from "./serverURL";


import axios, { AxiosResponse } from "axios";

const Axios = axios.create({
  baseURL: `${SERVER_URL_vendor}`,
  headers: {
    "Content-Type": "application/json",
  },  withCredentials: true, 

});

export const SignUpAPI = async (
  reqBody: any,
  reqHeader: { "Content-Type": string } | undefined
) => {
  console.log('vendor Signup');

  return await commonAPI("POST", `${SERVER_URL_vendor}/signup`, reqBody, reqHeader);
};

export const LoginAPI = async (reqBody: any) => {
  try {
    const response = await Axios.post(`${SERVER_URL_vendor}/login`, reqBody, );
    return response.data;
  } catch (error:any) {
    console.error("API call error:", error);
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message); 
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};


export const verifyOtp = async (data: any) => {
  console.log("comming: " + data);
  return Axios.post("/verifyOtp", data);
};


export const addDishAPI = async (data: any) => {
  try {
    const formData = new FormData();
    console.log('hey hey hey----dish');

    for (const key in data) {
      formData.append(key, data[key]);
    }
    const res = await Axios.post(`${SERVER_URL_vendor}/addDishes`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
     
    });
    return res;
  } catch (error) {
    console.error('Error in addDishAPI:', error);
  }
};



export const getPresignedUrl = async (fileName: string, fileType: string) => {
  try {
    console.log("Fetching pre-signed URL");
    const response = await Axios.get(`${SERVER_URL_vendor}/getPresignedUrl`, {
      params: { fileName, fileType },
    
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
    return await Axios.post(`${SERVER_URL_vendor}/addAuditorium`, data, );
  } catch (error) {
    console.error('error');

  }
}

export const vendorDetails = async (): Promise<AxiosResponse<any>> => {
  try {
    console.log('Fetching vendor details');
    return await Axios.get(`${SERVER_URL_vendor}/getAddress`);
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    throw error;
  }
}



export const editDetails = async (vendorData: any) => {
  try {
    console.log('Editing vendor details');
    return await Axios.put(`${SERVER_URL_vendor}/editVendor`, vendorData);
  } catch (error) {
    console.error('Error updating vendor details:', error);
    throw error;
  }
};

export const VendorEdit = async (data: any) => {

  try {
    return await Axios.patch(`${SERVER_URL_vendor}/editVendorDetails`, data,    );
  } catch (error) {
    console.error('Error updating vendor details:', error);
    throw error;
  }


}

export const fetchvendor = async (vendorId: string) => {
  try {
    console.log('rdyyyyy');

    const res = await Axios.get(`${SERVER_URL_vendor}/fetchVendorDetails/${vendorId}`);
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);

  }
};




export const fetchdishes = async (dishesId: string) => {
  try {
    console.log('rdyyyyy');

    const res = await Axios.get(`${SERVER_URL_vendor}/fetchdishes/${dishesId}`);
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);

  }
};


export const fetchDetailsVendor = async (vendorId: string) => {
  try {

    console.log('pokunnu  detils ');

    const res = await Axios.get(`${SERVER_URL_vendor}/fetchDetailsVendor/${vendorId}`);
    return res.data; // Return data directly for easier usage in the component
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    throw new Error('Failed to fetch vendor details');
  }
};




export const FetchDishes = async (vendorId: string) => {
  try {

    console.log('pokunnu food');

    const res = await Axios.get(`${SERVER_URL_vendor}/fetchFoodDetails/${vendorId}`);
    return res.data; // Return data directly for easier usage in the component
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    throw new Error('Failed to fetch vendor details');
  }
};


export const fetchReviews = async (vendorId: string) => {
  try {
    console.log('Fetching review');

    const res = await Axios.get(`${SERVER_URL_vendor}/fetchReviews/${vendorId}`);
                            // (`${SERVER_URL_vendor}/fetchFoodDetails/${vendorId}
    console.log(res, '0---------k');

    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch vendor details');
  }
};




export const FetchAuditorium = async (vendorId: string) => {
  try {

    console.log('pokunnu hall');

    const res = await Axios.get(`${SERVER_URL_vendor}/fetchAuditoriumDetails/${vendorId}`);
    return res.data; // Return data directly for easier usage in the component
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    throw new Error('Failed to fetch vendor details');
  }
};



export const fetchauditorium = async (auditoriumId: string) => {
  try {
    console.log('rdyyyy auditirum profie');

    const res = await Axios.get(`${SERVER_URL_vendor}/fetchauditorium/${auditoriumId}`);
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);

  }
};



export const deleteDish = async (dishId: string,) => {
  try {
    console.log('Attempting to delete dish');
    const response = await Axios.patch(`${SERVER_URL_vendor}/dishes/${dishId}`, {
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
    const response = await Axios.patch(`${SERVER_URL_vendor}/auditorium/${aditoriumId}`, {
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
    const response = await Axios.patch(`${SERVER_URL_vendor}/approveReview/${reviewId}`, {
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
    const response = await Axios.delete(`${SERVER_URL_vendor}/rejectReview/${reviewId}`,);
    return response.data;
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw new Error('Failed to delete dish');
  }
};















export const vendorChats = (id: string) => {
  return Axios.get(`${server_URL_chat}/company/${id}`);
};




export const SaveChat = async (reqBody: { text: string; senderId: string | null; vendorId: string | null }) => {
  try {
    console.log('Sending request to save chat:', reqBody); // Debugging line
    const response = await Axios.post(`${server_URL_chat}/savechat`, reqBody, );
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

    return Axios.get(`${server_URL_chat}/message/${id}`);
  } catch (error: any) {
    console.log(error);
  }
};


export const getUnreadMessagesCountAPI = async () => {
  try {
    const response = await Axios.get(`${SERVER_URL_vendor}/unread-count`, );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);

  }
};






export const messageSend = async (reqBody: { text: string; senderId: string | null; userId: string | null }) => {
  try {
    const response = await Axios.post(`${server_URL_chat}/message`, reqBody, );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};








export const vendorBookingDetils = async (vendorId: string) => {
  try {
    const response = await Axios.get(`${SERVER_URL_vendor}/vendorBookingDetils/${vendorId}`);
    console.log(response.data, 'api call retuen');

    return response.data;
  } catch (error) {
    console.error('Error fetching booking data:', error);
    throw error;
  }
};



export const createSlotAPI = async (reqBody: { startDate: Date, endDate: Date }, vendorId: string) => {
  try {
    const response = await Axios.post(`${SERVER_URL_vendor}/create-slot/${vendorId}`, reqBody);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create slot");
  }
};


export const getSlotsByWorkerAPI = async (vendorId: string) => {
  try {
    const response = await Axios.get(`${SERVER_URL_vendor}/slots/${vendorId}`);
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

    const response = await Axios.post(`${SERVER_URL_vendor}/serviceImage/`, {
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



export const dateAvailability = async (vendorId: string, startingDate: string, endingDate: string): Promise<any> => {
  try {
      const response = await Axios.post("/dateAvailability", { vendorId, startingDate, endingDate });
      console.log('API response:', response);
      return response;
  } catch (error) {
      console.error("Error while calling dateAvailability API:", error);
      throw error;
  }
};


export const logoutApiVendor = async () => {
  try {
    const response = await Axios.post(`${SERVER_URL_vendor}/logout`,);
    console.log("response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching logout API:", error);
    throw error;
  }
};
