import axios from "axios";

// start of axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
  withCredentials: true, // send cookies to server
});
// end of axios instance

export default axiosInstance;