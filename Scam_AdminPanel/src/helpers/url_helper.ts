// Auth
export const LOGIN = "/login";
export const SIGNUP = "/signup";
export const CHANGE_PASSWORD = "/change-password"

// Users
export const GET_USER_LIST = "/users";

// Complaints
export const GET_MY_COMPLAINTS = "/complaints/feed";
export const CREATE_COMPLAINT = "/complaints";
export const UPDATE_COMPLAINT = (id: number) => `/complaints/${id}`;
export const DELETE_COMPLAINT = (id: number) => `/complaints/${id}`;

//Emergency 
export const GET_EMERGENCY_MESSAGES = "/emergency-messages";
export const CREATE_EMERGENCY_MESSAGE = "/emergency-messages";
export const DELETE_EMERGENCY_MESSAGE = (id: number) => `/emergencynotification/${id}`;

export const GET_DASHBOARD = "/dashboard/counts";

export const GET_PROFILE = "/profile";