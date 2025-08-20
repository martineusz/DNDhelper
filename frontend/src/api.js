import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000/api/",
});

export const login = async (username, password) => {
    const response = await API.post("token/", {username, password});
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    return response.data;
};

export const register = async (username, password) => {
    const response = await API.post("users/", {username, password});
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};
