import { createBrowserRouter } from "react-router";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import DashBoard from "../pages/dashboard/DashBoard";
import PrivateChannelPage from "../pages/channel/PrivateChannelPage";
import RootLayout from "../layout/RootLayout";

import { authMiddleware, loggedInMiddleware } from "../auth/authMiddleware";
import AppLayout from "../layout/AppLayout";
import RootErrorBoundary, { NotFoundPage } from "../pages/error/ErrorPage";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    ErrorBoundary: RootErrorBoundary,
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
        Component: AppLayout,
        children: [
          {
            path: "/",
            Component: DashBoard,
          },
          {
            path: "channels/:channelId",
            Component: PrivateChannelPage,
          },
        ],
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);

export default router;
