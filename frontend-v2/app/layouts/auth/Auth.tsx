import { Outlet } from "react-router";
import { guestMiddleware } from "~/lib/auth-middleware";
import type { Route } from "./+types/Auth";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  guestMiddleware,
];

function AuthLayout() {
  return (
    <main className="flex justify-center items-center h-screen bg-[url('/images/auth-bg.png')] bg-cover bg-center">
      <div className="w-3/10 h-7/10 rounded-lg shadow-2xl bg-zinc-800 p-8 ">
        <Outlet />
      </div>
    </main>
  );
}

export default AuthLayout;
