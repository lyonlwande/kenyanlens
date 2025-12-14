import axios from "axios";
import useAuthStore from "../zustandStores/authStore.js";

export const axiosInstance = axios.create({
  baseURL: "/api", // Base URL for your API (use your PC's local IP)
  withCredentials: true, // Ensure cookies are sent with requests
});

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage or cookies
    const token = localStorage.getItem("authToken"); // Or use cookies if you're storing it there
    if (token) {
      // Attach the token in the Authorization header
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors and refresh token


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const success = await useAuthStore.getState().refreshToken();
      if (success) {
        // Update Authorization header with new token
        originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
