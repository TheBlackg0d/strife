import { createBrowserRouter } from "react-router";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import DashBoard from "../pages/dashboard/DashBoard";
import RootLayout from "../layout/RootLayout";

import { authMiddleware, loggedInMiddleware } from "../auth/authMiddleware";
import AppLayout from "../layout/AppLayout";

import { queryClient } from "../main";
import { createProfileQueryOptions } from "../query-options/profile-query-options";
import createFriendListQueryOptions from "../pages/dashboard/query-options/friend-list-query-option";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "login",
        Component: Login,
        middleware: [loggedInMiddleware],
      },
      {
        path: "register",
        Component: Register,
        middleware: [loggedInMiddleware],
      },
      {
        id: "protected",
        middleware: [authMiddleware],
        loader: () => queryClient.query(createProfileQueryOptions()),

        Component: AppLayout,
        children: [
          {
            path: "/",
            loader: () => queryClient.query(createFriendListQueryOptions()),
            Component: DashBoard,
          },
        ],
      },
    ],
  },
]);

export default router;
