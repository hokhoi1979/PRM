import axios from "axios";

const API_URL=process.env.EXPO_PUBLIC_API_URL;

export const fetchApi = async () =>{
    try {
        const response = await axios.get(`${API_URL}`);
        if(response.status === 200 || response.status === 201){
            return response.data;
        }
    } catch (error) {
        console.log((error))
    }
}