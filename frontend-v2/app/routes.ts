import { type RouteConfig, layout } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  layout(
    "layouts/auth/Auth.tsx",
    await flatRoutes({ rootDirectory: "routes/auth" }),
  ),
  layout(
    "layouts/app/AppLayout.tsx",
    await flatRoutes({ rootDirectory: "routes/app" }),
  ),
] satisfies RouteConfig;
