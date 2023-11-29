import axios from "axios";
const BASE_URL = import.meta.env.VITE_APP_BE_ENDPOINT;
  
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAPIParams = async (data) => {
  let passingData = data.data === undefined ? {} : data.data;
  return await getAPICall(data.url, passingData);
};

export const getAPICall = async (url, params) => {
  return await axios
    .get(`${BASE_URL}${url}`, {params:params}, {
    })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      let data = {
        status: error.response.status,
        success: false,
        error: error.message,
        data: error.response?.data,
      };
      return data;
    });
};

export default API;
