import { createBrowserRouter, type LoaderFunctionArgs } from "react-router";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import DashBoard from "../pages/dashboard/DashBoard";
import RootLayout from "../layout/RootLayout";
import type { Account } from "../auth/types/auth";
import { userContext } from "../auth/context";
import { authMiddleware, loggedInMiddleware } from "../auth/authMiddleware";
import AppLayout from "../layout/AppLayout";

import { queryClient } from "../main";
import createFriendListQueryOptions from "../pages/dashboard/types/friend-list-query-option";

export interface ProtectedLoaderData {
  account: Account;
}

function protectedLoader({ context }: LoaderFunctionArgs): ProtectedLoaderData {
  return { account: context.get(userContext) };
}

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
        loader: protectedLoader,

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
