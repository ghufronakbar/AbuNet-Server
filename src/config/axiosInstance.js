import { ACCESS_TOKEN } from "@/constant/keyStore";
import axios from "axios";
import Cookies from "js-cookie";
const axiosInstance = axios.create({
    baseURL: "/api/admin"
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
