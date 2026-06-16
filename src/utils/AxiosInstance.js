import axios from "axios";

/*http://localhost:5000*/
//https://smash-gym-server-rrsoft.vercel.app/api

const axiosInstance = axios.create({
  baseURL: "https://smash-gym-server-rrsoft.vercel.app/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
