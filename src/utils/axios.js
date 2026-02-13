import axios from "axios";

const api = axios.create({
  baseURL: "https://devika-backend.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
