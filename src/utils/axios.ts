import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const user = JSON.parse(localStorage.getItem("userDetails") || "{}");
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${user?.token}`,
  },
});

export default axiosInstance;