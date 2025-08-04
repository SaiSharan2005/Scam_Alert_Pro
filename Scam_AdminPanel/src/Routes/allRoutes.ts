import Analytics from "pages/Dashboards/Analytics";
import UserListView from "pages/Dashboards/Users/ListView";
import ComplaintsPage from "pages/Dashboards/ComplaintScreen/ComplaintsListView";
import Login from "pages/Authentication/Login";
import Logout from "pages/Authentication/LogOut";
import Register from "pages/Authentication/Register";
import AdminEmergencyMessages from "pages/Dashboards/EmergencyMessages/EmergencyMessages";
import ChangePassword from "pages/Authentication/ChangePassword";

interface RouteObject {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}

const authProtectedRoutes: Array<RouteObject> = [
  // Dashboard
  { path: "/", component: Analytics },
  { path: "/dashboards-analytics", component: Analytics },
  { path: "/complaintpage", component: ComplaintsPage },
  { path: "/emergency-notification", component: AdminEmergencyMessages },
  { path: "/apps-users-list", component: UserListView },
  { path: "/change-password", component: ChangePassword },
];

const publicRoutes = [

  // authentication
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
  { path: "/register", component: Register },
];

export { authProtectedRoutes, publicRoutes };
