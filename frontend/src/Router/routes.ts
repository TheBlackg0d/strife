import { createBrowserRouter, type LoaderFunctionArgs } from "react-router";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import RootLayout from "../layout/RootLayout";
import type { User } from "../auth/types/auth";
import { userContext } from "../auth/context";
import { authMiddleware, loggedInMiddleware } from "../auth/authMiddleware";
import AppLayout from "../layout/AppLayout";
import DashBoard from "../pages/dashboard/DashBoard";

export interface ProtectedLoaderData {
  user: User;
}

function protectedLoader({ context }: LoaderFunctionArgs): ProtectedLoaderData {
  return { user: context.get(userContext) };
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
            Component: DashBoard,
          },
        ],
      },
    ],
  },
]);

export default router;
