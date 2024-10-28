/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { PAYMENT_SERVICE_DOMAIN } from "../constansts";
// import { SERVER_URL } from "@/app/services/serverURL";
import { SERVER_URL } from "@/services/serverURL";


const apiClient = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
  timeout: 120000,
});

export default {
  addTransaction: async function (
    PayUOrderId: string,
    email: string,
    status: "success" | "failed"
  ) {
    try {
      const res = await apiClient.post("/addTransaction", {
        PayUOrderId,
        email,
        status,
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  getPosts: async function () {
    try {
      const res = await apiClient.get("/getPosts");
      return res.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};