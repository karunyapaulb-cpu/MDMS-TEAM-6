import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "../shared/layout/AppLayout";
import UtilityPage from "../shared/pages/UtilityPage";
import { menuConfig } from "../shared/layout/menuConfig";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    lazy: async () => ({
      Component: (await import("../features/auth/pages/Login")).default,
    }),
  },
  {
    path: "/forgot-password",
    lazy: async () => ({
      Component: (await import("../features/auth/pages/ForgotPassword"))
        .default,
    }),
  },
  {
    path: "/reset-password/:token",
    lazy: async () => ({
      Component: (await import("../features/auth/pages/ResetPassword")).default,
    }),
  },
  {
    element: <AppLayout />,
    errorElement: <UtilityPage code="500" title="Server error" />,
    children: [
      ...Object.values(menuConfig)
        .flat()
        .map((item) => ({
          path: item.path,
          element: (
            <div>
              <h1>{item.label}</h1>
              <p>Page under development</p>
            </div>
          ),
        })),
      {
        path: "/profile",
        element: <h1>Profile & Settings</h1>,
      },
    ],
  },
  {
    path: "/maintenance",
    element: <UtilityPage code="503" title="Under maintenance" />,
  },
  {
    path: "/access-denied",
    element: <UtilityPage code="403" title="Access denied" />,
  },
  {
    path: "*",
    element: <UtilityPage code="404" title="Page not found" />,
  },
]);
