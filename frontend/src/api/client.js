import axios from "axios";

// Base URL for the backend API. In development this points at the local
// Express server; in production it's set via the VITE_API_URL env var
// (see .env.example) to your deployed Heroku backend URL.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const client = axios.create({ baseURL });

// Attach the JWT (if we have one) to every outgoing request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so components can just read err.message.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong.";
    return Promise.reject(new Error(message));
  }
);

export default client;
