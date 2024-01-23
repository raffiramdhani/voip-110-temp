import axios from "axios";
import { API_URL_POLRI } from "./api";
const httpPolri = (token = null) => {
  const headers = token && {
    authorization: `Bearer ${token}`,
    access_key: import.meta.env.VITE_SUPERAPPS_POLRI_ACCESS_KEY,
    app_key: import.meta.env.VITE_SUPERAPPS_POLRI_APP_KEY,
  };
  return axios.create({
    baseURL: API_URL_POLRI,
    headers,
  });
};

export default httpPolri;
