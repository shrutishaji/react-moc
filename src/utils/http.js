/* eslint-disable no-undef */
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const handleError = async (error) => {
  let err = {
    status: 500,
    message: "error_message",
  };

  if (error.response) {
    if (error.response.status === 401) {
      // Show toast error message
      toast.error("Session expired. Please log in again.");

      // Clear local storage and redirect to login page
      localStorage.clear();
      setTimeout(() => {
        window.location = `${import.meta.env.VITE_APP_API_BASE_URL}/sign-in`;
      }, 2000); // Delay to allow toast to show
      return;
    }

    if (error.response.status === 403) {
      toast.error("Access denied. Please log in.");
      localStorage.clear();
      setTimeout(() => {
        window.location = `${import.meta.env.VITE_APP_API_BASE_URL}/sign-in`;
      }, 2000); // Delay to allow toast to show
      return;
    } else if (error.response.status === 500) {
      toast.error("Internal server error.");
      err = {
        status: error.response.status,
        message: "error_message",
      };
    } else if (error.response.status === 503) {
      err = {
        status: error.response.status,
        message: "App is under maintenance",
      };
      toast.error("App is under maintenance");
      setTimeout(() => {
        window.location = `${import.meta.env.VITE_APP_API_BASE_URL}/under-maintenance`;
      }, 2000); // Delay to allow toast to show
      return;
    } else if (error.response.status === 400) {
      err = {
        errorsData: error.response.data.errors || {},
        message: error.response.data.message || err.message,
        status: error.response.status,
        errors: error.response.data.messages || {},
      };
    } else {
      err = {
        status: error.response.status,
        message: error.response.data.message || "error_message",
      };
    }
  }

  return Promise.reject(err);
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

export const apiTicketClient = axios.create({
  baseURL: "https://pmprofiles.tebs.co.in/api/v1",
  headers: {
    Accept: "application/json",
  },
});

export const apiTicketAuth = axios.create({
  baseURL: "https://pmprofiles.tebs.co.in/api/v1/",
  headers: {
    Accept: "application/json",
  },
});

const getToken = () => localStorage.getItem("jwt_access_token");
apiAuth.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const getTokenTicket = () => localStorage.getItem("jwt_access_ticket_token");
apiTicketAuth.interceptors.request.use((config) => {
  const tokenTicket = getTokenTicket();
  if (tokenTicket) {
    config.headers.Authorization = `Bearer ${tokenTicket}`;
  }
  return config;
});

apiClient.interceptors.request.use((config) => {
  if (
    config.url !==
    `${import.meta.env.VITE_APP_API_BASE_URL}/auth/admin/refresh-token`
  ) {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const handleResponseError = (error) => {
  if (error.response && error.response.status === 401) {
    // Clear local storage and redirect to login page
    localStorage.clear();

    toast.error("Session expired. Please log in again.");

    setTimeout(() => {
      window.location.href = `/sign-in`;
    }, 500);
    return;
  }
  return handleError(error);
};

apiClient.interceptors.response.use((res) => res, handleResponseError);
apiAuth.interceptors.response.use((res) => res, handleResponseError);
apiTicketAuth.interceptors.response.use((res) => res, handleResponseError);
