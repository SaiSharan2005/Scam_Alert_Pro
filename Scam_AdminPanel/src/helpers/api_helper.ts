import axios, { AxiosRequestConfig } from "axios";

axios.defaults.baseURL = "http://localhost:5000/admin";
axios.defaults.headers.post["Content-Type"] = "application/json";

// Auth token setup
const authUser: any = localStorage.getItem("authUser");
const token = authUser ? JSON.parse(authUser)?.token : null;
if (token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

// Response interceptor
axios.interceptors.response.use(
  (response) => (response.data ? response.data : response),
  (error) => {
    switch (error.status) {
      case 500:
        error = "Internal Server Error";
        break;
      case 401:
        error = "Invalid credentials";
        break;
      case 404:
        error = "Not Found";
        break;
      default:
        error = error.error || error;
    }
    return Promise.reject(error);
  }
);

// Helper to set token later
const setAuthorization = (token: string) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  get = (url: string, params?: any, config?: AxiosRequestConfig) => {
    let queryString = "";
    if (params) {
      queryString = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&");
    }

    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return axios.get(fullUrl, config); 
  };

  create = (url: string, data: any, config?: AxiosRequestConfig) => {
    return axios.post(url, data, config);
  };

  update = (url: string, data: any, config?: AxiosRequestConfig) => {
    return axios.patch(url, data, config);
  };

  put = (url: string, data: any, config?: AxiosRequestConfig) => {
    return axios.put(url, data, config);
  };

  delete = (url: string, config?: AxiosRequestConfig) => {
    return axios.delete(url, config);
  };
}

// Logged-in user
const getLoggedUser = () => {
  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

export { APIClient, setAuthorization, getLoggedUser };
