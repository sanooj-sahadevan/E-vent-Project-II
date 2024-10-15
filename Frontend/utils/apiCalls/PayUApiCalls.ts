/* eslint-disable import/no-anonymous-default-export */
// import { SERVER_URL } from "@/app/services/serverURL";
import { SERVER_URL } from "@/services/serverURL";

import axios from "axios";

const apiClient = axios.create({
  baseURL: `${SERVER_URL}`,
  withCredentials: true,
  timeout: 120000,
});

export const PayUUrl = {
  payment: `${SERVER_URL}/payment`,
  response: `${SERVER_URL}/response`,
  test: `${SERVER_URL}/response/test`,
};

export default {

  paymentReq: async function (data: any) {
    console.log('routikii');

    try {
      const reshash = await apiClient.post("/payment", JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log({ reshash },'ooooooooooooooooooooooo')
      return reshash.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  response: async function (pd: any) {
    try {
      const response = await apiClient.post("/response", JSON.stringify(pd), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log({ response })
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  saveData: async function (pd: any) {
    try {
      const response = await apiClient.post("/response/saveData", JSON.stringify(pd), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response, 'ooooooooooooooooooooooooooooooooooooooo');

      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};