import axios from "axios";
const BASE_URL = import.meta.env.VITE_APP_BE_ENDPOINT;

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API.interceptors.request.use(
//   (config) => {
//     const authToken = Storage.loadToken();
//     if (authToken) {
//       config.headers.Authorization = `Bearer ${authToken}`;
//     }
//     return config;
//   },
//   (err) => Promise.reject(err)
// );

// API.interceptors.response.use(
//   (res) => {
//     return res;
//   },
//   (err) => {
//     if (err?.response?.status === 401) {
//       NotificationMessage("warning","You've been signed out")
//       localStorage.removeItem("token");
//       window.location.href = "/sign-in";
//     }else if(err?.response?.status === 403){
//       NotificationMessage("warning","Request forbidden")
//       window.location.href = "/sign-in";
//     }
//     throw err;
//   }
// );

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
      console.error("Error in getAPICall gettRequest", error);
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