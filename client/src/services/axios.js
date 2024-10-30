import axios from "axios";

const UrlApi = import.meta.env.VITE_BACKEND_URL;

const axiosConfig = axios.create({
  withCredentials: true, 
  baseURL: UrlApi,
});

export default axiosConfig;
