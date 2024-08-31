import axios from 'axios';

// // If you don't need a specific axios instance, you can use default axios
export const commonAPI = async (method: string, url: string, body?: any, headers?: Record<string, string>) => {
  try {
    console.log('axiosss');
    
    const response = await axios.request({
      url,
      method,
      data: body,
      headers: headers ? { ...headers } : {},
    });
    console.log('axx sucess');
    
    return response.data;
  } catch (error) {
    throw error;
  }
};


// export const commonAPI = async (method: string, url: string, body?: any, headers?: Record<string, string>) => {
//   try {
//     console.log('commonAPI - Request:', { method, url, body, headers });
    
//     const response = await axios.request({
//       url,
//       method,
//       data: body,
//       headers: headers ? { ...headers } : {},
//       withCredentials: true, // Ensure credentials are included
//     });
    
//     console.log('commonAPI - Success:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('commonAPI - Error:', error);
//     throw error;
//   }
// };










// import axios from 'axios';

// export const commonAPI = async (
//   method: string,
//   url: string,
//   body?: any,
//   headers: Record<string, string> = {}
// ) => {
//   try {
//     console.log('axisos');
    
//     const response = await axios.request({
//       url,
//       method,
//       data: body,
//       headers, // Spread headers directly, no need to check for headers being undefined
//     });
//     console.log(response);
    
//     console.log('axisos submit');

//     return response.data;
//   } catch (error) {
//     console.error('Error in commonAPI:', error);
//     throw error;
//   }
// };
