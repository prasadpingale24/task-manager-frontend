import axios from "axios";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      toast.error("Access Denied. You don't have permission for this action.");
    } else if (error.response?.status === 400) {
      const msg = error.response.data?.detail || "Invalid request.";
      toast.error(typeof msg === 'string' ? msg : "Validation error.");
    } else if (error.response?.status >= 500) {
      toast.error("An unexpected error occurred on the server.");
    }
    return Promise.reject(error);
  }
);
