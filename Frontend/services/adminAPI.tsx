import { server_URL_admin } from "./serverURL";
import { commonAPI } from "./commonAPI";


import axios from 'axios'

export const LoginAPI = async (reqBody: any)=>{
    console.log('admin logg');
    
    const response  = await axios.post(`${server_URL_admin}/login` ,reqBody,{withCredentials:true})
    console.log(response.data);
    
return response.data
}

// 20 2 2024

// IMP: profile vedor and user
// get auditoriums, amd dishes in vedor profile
// think the logic about user vendor profile
// show the dishes and auditorium