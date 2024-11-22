import { commonAPI } from "./commonAPI";
import { server_URL_chat } from "./serverURL";
import axios, { AxiosResponse } from "axios";


const Axios = axios.create({
  baseURL: `${server_URL_chat}`,

  headers: {
    "Content-Type": "application/json",
  }, withCredentials: true,

});

export const SaveChat = async (reqBody: { text: string; senderId: string | null; vendorId: string | null }) => {
  try {
    console.log('Sending request to save chat:', reqBody); // Debugging line
    const response = await Axios.post(`${server_URL_chat}/savechat`, reqBody,);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving chat:", error);
    throw error;
  }
};



export const userChats = (id: string) => {
  return Axios.get(`${server_URL_chat}/${id}`);
};


export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
  senderModel: string
) => {
  try {
    console.log(chatId, senderId, text);

    const response = await Axios.post(
      `${server_URL_chat}/message`,
      {
        chatId,
        senderId,
        text,
        senderModel,
      },

    );
    console.log(response);

    // Return the response data from the API
    return response.data;
  } catch (error: any) {
    console.error("Error while sending message:", error);
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};



export const getMessages = (id: string,) => {
  try {
    return Axios.get(`${server_URL_chat}/message/${id}`);
  } catch (error: any) {
    console.log(error);
  }
};


// company API;

export const companyChats = (id: string) => {
  console.log('first chat');

  return Axios.get(`${server_URL_chat}/company/${id}`);
};

export const messageSend = async (
  messageData: any
) => {
  try {
    console.log({ messageData });

    const response = await Axios.post(`${server_URL_chat}/message`, {
      messageData
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};



// export const vendorChats = (id: string) => {
//   return Axios.get(`${server_URL_chat}/company/${id}`);
// };


export const UserVendorChats = (id: string) => {
  let res = Axios.get(`${server_URL_chat}/usercompany/${id}`);
  console.log(res, '000000000000000000000000000000000000000000000000000');
  return res

};






export const UsersendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
  senderModel: string
) => {
  try {
    console.log(chatId, senderId, text);

    const response = await Axios.post(
      `${server_URL_chat}/message`,
      {
        chatId,
        senderId,
        text,
        senderModel,
      },

    );
    console.log(response);

    return response.data;
  } catch (error: any) {
    console.error("Error while sending message:", error);
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};



export const UsergetMessages = (id: string) => {
  try {
    console.log(id, 'pp');

    console.log('okkkkkkkkkkkkkkkkkkkkokkkkkkkkkkkkkkkkkkkk');

    return Axios.get(`${server_URL_chat}/message/${id}`);
  } catch (error: any) {
    console.log(error);
  }
};



export const UsermessageSend = async (reqBody: { text: string; senderId: string | null; userId: string | null }) => {
  try {
    const response = await Axios.post(`${server_URL_chat}/usermessage`, reqBody,);

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};

