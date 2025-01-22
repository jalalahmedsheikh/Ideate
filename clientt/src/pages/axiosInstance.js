// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Your backend URL
  withCredentials: true,  // Send cookies (JWT) with requests
});

export default axiosInstance;
