import { MonitorDot } from "lucide-react";

const menuData: any = [
  {
    label: "menu",
    isTitle: true,
  },
  {
    id: "dashboard",
    label: "Dashboards",
    link: "/#",
    icon: <MonitorDot />,
    subItems: [
      {
        id: "analyticsdashboard",
        label: "Analytics",
        link: "/dashboards-analytics",
        parentId: "dashboard",
      },
      {
        id: "userlistview",
        label: "Users view",
        link: "/apps-users-list",
        parentId: "dashboard",
      },
      {
        id: "posts",
        label: "Posts",
        link: "/complaintpage",
        parentId: "dashboard",
      },
      {
        id: "emergencynotification",
        label: "Emergency Notification",
        link: "/emergency-notification",
        parentId: "dashboard",
      },
      {
        id: "changepassword",
        label: "Change Password",
        link: "/change-password",
        parentId: "dashboard",
      },
    ],
  },
];

export { menuData };
