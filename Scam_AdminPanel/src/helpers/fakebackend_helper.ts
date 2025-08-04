import { APIClient } from "./api_helper";
import * as url from "./url_helper";

const api = new APIClient();

export const getLoggedUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isUserAuthenticated = () => getLoggedUser() !== null;

// Auth
export const loginadmin = (data: any) => api.create(url.LOGIN, data);
export const signupadmin = (data: any) => api.create(url.SIGNUP, data);

export const changePasswordAPI = (data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => api.create(url.CHANGE_PASSWORD, data);



// Users
export const getUserList = () => api.get(url.GET_USER_LIST, null);

// ✅ Complaints

export const getMyComplaintsAPI = () =>
  api.get(url.GET_MY_COMPLAINTS, null);


export const getEmergencyMessagesAPI = () =>
  api.get(url.GET_EMERGENCY_MESSAGES, null);


export const createEmergencyMessageAPI = (data: { text: string }) =>
  api.create(url.CREATE_EMERGENCY_MESSAGE, data).then((res) => res.data);

export const deleteEmergencyMessageAPI = (id: number) =>
  api.delete(url.DELETE_EMERGENCY_MESSAGE(id), {}).then((res) => res.data);


export const createComplaintAPI = (formData: FormData) =>
  api.create(url.CREATE_COMPLAINT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);

export const updateComplaintAPI = (id: number, formData: FormData) =>
  api.create(url.UPDATE_COMPLAINT(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);

export const deleteComplaintAPI = (id: number) =>
  api.delete(url.DELETE_COMPLAINT(id), {}).then((res) => res.data);

export const getDashboardCountsAPI = () =>
  api.get(url.GET_DASHBOARD, null);

export const getProfile = () =>
  api.get(url.GET_PROFILE, null);



