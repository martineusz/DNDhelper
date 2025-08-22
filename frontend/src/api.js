import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/",
});

// Add Authorization header before each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          // Get new access token
          const res = await axios.post("http://localhost:8000/api/token/refresh/", {
            refresh,
          });

          const newAccess = res.data.access;
          localStorage.setItem("access_token", newAccess);

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return API(originalRequest); // 👈 retry instead of failing
        } catch (refreshError) {
          // Refresh failed → logout
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }

    // For other errors
    return Promise.reject(error);
  }
);


export default API;

// Example auth functions
export const login = async (username, password) => {
  const response = await API.post("token/", { username, password });
  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);
  return response.data;
};

export const register = async (username, password) => {
  const response = await API.post("users/", { username, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
