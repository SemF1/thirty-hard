import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const fetchUsers = () => API.get("/users");
export const createUser = (data) => API.post("/users", data);
export const logProgress = (data) => API.post("/progress", data);
export const getProgress = (userId) => API.get(`/progress/${userId}`);
