import { server_URL_admin } from "./serverURL";
import { commonAPI } from "./commonAPI";


import axios from 'axios'

export const LoginAPI = async (reqBody: any) => {
  console.log('admin logg');
  const response = await axios.post(`${server_URL_admin}/login`, reqBody, { withCredentials: true })
  console.log(response.data);
  return response.data
}


export const getAllUsersAPI = async (token: string) => {
  try {
    const response = await commonAPI(
      "GET",
      `${server_URL_admin}/getAllUsers`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log(response, 'api');
    return response;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};



export const unblockUserAPI = async (userId: string, token: string) => {
  return await axios.put(
    `${server_URL_admin}/unblockUser/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const blockUserAPI = async (userId: any, token: string) => {
  return await axios.put(
    `${server_URL_admin}/blockUser/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const blockVendorAPI = async (userId: any, token: string) => {
  return await axios.put(
    `${server_URL_admin}/vendor/blockUser/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getAllVendorAPI = async (token: string) => {
  try {
    const response = await commonAPI(
      "GET",
      `${server_URL_admin}/getAllVendors`,
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log(response);

    return response;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};


export const unblockVendorAPI = async (userId: any, token: string) => {
  return await axios.put(
    `${server_URL_admin}/vendor/unblockUser/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getAllBookingsAPI = async (token: string) => {
  try {
    const response = await axios.get(`${server_URL_admin}/getAllBookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Api---------------', response);

    return response
  } catch (error: any) {
    throw new Error(error.response.data.message || "Failed to fetch reports");
  }
};




export const fetchingAllData = async (token: string) => {
  const response = await axios.get(`${server_URL_admin}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('response ta ',response.data);

  return response.data;
};