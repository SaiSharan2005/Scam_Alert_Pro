import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// login
import LoginReducer from "./auth/login/reducer";

// register
import RegisterReducer from "./auth/register/reducer";

import ChangePasswordReducer from "./auth/changepassword/reducer";


// userProfile
import ProfileReducer from "./auth/profile/reducer";

import complaintsReducer from "./complaints/reducer";

import emergencyReducer from "./emergencynoti/reducer";

import dashboard from "./dashboard/reducer";

// Users
import UsersReducer from "./users/reducer";

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Login: LoginReducer,
  Register: RegisterReducer,
  ChangePassword: ChangePasswordReducer,
  Profile: ProfileReducer,
  Complaints: complaintsReducer,
  Emergency: emergencyReducer,
  Dashboard: dashboard,
  Users: UsersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
