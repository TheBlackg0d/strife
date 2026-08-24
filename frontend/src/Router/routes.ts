import { createBrowserRouter } from "react-router";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
const router = createBrowserRouter([
  {
    path: "/",
    Component: Register,
  },
  {
    path: "/login",
    Component: Login,
  },
]);

export default router;
