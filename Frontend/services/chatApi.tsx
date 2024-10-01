import { commonAPI } from "./commonAPI";
import { server_URL_chat } from "./serverURL";
import axios from 'axios'


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



export const userChats = (id: string) => {
    return axios.get(`${server_URL_chat}/${id}`);
  };
  

export const sendMessage = async (
    chatId: string,
    senderId: string,
    text: string,
    senderModel: string
  ) => {
    try {
      console.log(chatId, senderId, text);
  
      const response = await axios.post(
        `${server_URL_chat}/message`,
        {
          chatId,
          senderId,
          text,
          senderModel,
        },
        {
          withCredentials: true, 
        }
      );
      console.log(response);
  
      // Return the response data from the API
      return response.data;
    } catch (error: any) {
      console.error("Error while sending message:", error);
      throw new Error(error.response?.data?.message || "Failed to send message");
    }
  };
  


  export const getMessages = (id: string, ) => {
    try {
      return axios.get(`${server_URL_chat}/message/${id}`);
    } catch (error: any) {
      console.log(error);
    }
  };

  
  // company API;
  
  export const companyChats = (id: string) => {
    console.log('first chat');
    
    return axios.get(`${server_URL_chat}/company/${id}`);
  };
  
  export const messageSend = async (
    messageData: any
  ) => {
    try {
      console.log({messageData});
  
      const response = await axios.post(`${server_URL_chat}/message`, {
        messageData
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to send message");
    }
  };