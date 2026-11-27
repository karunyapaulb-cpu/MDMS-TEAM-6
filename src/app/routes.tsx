import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "../shared/layout/AppLayout";
import UtilityPage from "../shared/pages/UtilityPage";
import Skeleton from "../shared/components/Skeleton";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
    errorElement: <UtilityPage code="500" title="Server error" />,
  },

  // Authentication

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

  // Shared application layout

  {
    element: <AppLayout />,

    hydrateFallbackElement: <Skeleton />,

    errorElement: <UtilityPage code="500" title="Server error" />,

    children: [
      // End-user routes

      {
        path: "/user",
        element: <Navigate to="/user/dashboard" replace />,
      },
      {
        path: "/user/dashboard",
        lazy: async () => ({
          Component: (await import("../features/end-user/pages/Dashboard"))
            .default,
        }),
      },
      {
        path: "/user/bills",
        lazy: async () => ({
          Component: (await import("../features/end-user/pages/Bills")).default,
        }),
      },
      {
        path: "/user/bills/:billId",
        lazy: async () => ({
          Component: (await import("../features/end-user/pages/BillDetails"))
            .default,
        }),
      },
      {
        path: "/user/meter-data",
        lazy: async () => ({
          Component: (await import("../features/end-user/pages/MeterData"))
            .default,
        }),
      },
      {
        path: "/user/alerts",
        lazy: async () => ({
          Component: (await import("../features/end-user/pages/Alerts"))
            .default,
        }),
      },

      // Zone routes

      {
        path: "/zone",
        element: <Navigate to="/zone/dashboard" replace />,
      },
      {
        path: "/zone/dashboard",
        lazy: async () => ({
          Component: (await import("../features/zone/pages/Dashboard")).default,
        }),
      },
      {
        path: "/zone/meters",
        lazy: async () => ({
          Component: (await import("../features/zone/pages/Meters")).default,
        }),
      },
      {
        path: "/zone/meters/:meterId",
        lazy: async () => ({
          Component: (await import("../features/zone/pages/MeterDetails"))
            .default,
        }),
      },
      {
        path: "/zone/users",
        lazy: async () => ({
          Component: (await import("../features/zone/pages/Users")).default,
        }),
      },
      {
        path: "/zone/reports",
        lazy: async () => ({
          Component: (await import("../features/zone/pages/Reports")).default,
        }),
      },
      {
        path: "/zone/alerts",
        lazy: async () => ({
          Component: (await import("../features/zone/pages/Alerts")).default,
        }),
      },
      {
        path: "/zone/settings",
        lazy: async () => ({
          Component: (await import("../features/zone/pages/Settings")).default,
        }),
      },

      // Enterprise routes

      {
        path: "/enterprise",
        element: <Navigate to="/enterprise/dashboard" replace />,
      },
      {
        path: "/enterprise/dashboard",
        lazy: async () => ({
          Component: (await import("../features/enterprise/pages/Dashboard"))
            .default,
        }),
      },
      {
        path: "/enterprise/zones",
        lazy: async () => ({
          Component: (await import("../features/enterprise/pages/Zones"))
            .default,
        }),
      },
      {
        path: "/enterprise/zones/:zoneId",
        lazy: async () => ({
          Component: (await import("../features/enterprise/pages/ZoneDetails"))
            .default,
        }),
      },
      {
        path: "/enterprise/meters",
        lazy: async () => ({
          Component: (await import("../features/enterprise/pages/Meters"))
            .default,
        }),
      },
      {
        path: "/enterprise/meters/:meterId",
        lazy: async () => ({
          Component: (await import("../features/zone/pages/MeterDetails"))
            .default,
        }),
      },
      {
        path: "/enterprise/users",
        lazy: async () => ({
          Component: (await import("../features/enterprise/pages/Users"))
            .default,
        }),
      },
      {
        path: "/enterprise/reports",
        lazy: async () => ({
          Component: (await import("../features/enterprise/pages/Reports"))
            .default,
        }),
      },
      {
        path: "/enterprise/alerts",
        lazy: async () => ({
          Component: (await import("../features/enterprise/pages/Alerts"))
            .default,
        }),
      },
      {
        path: "/enterprise/audit-logs",
        lazy: async () => ({
          Component: (await import("../features/enterprise/pages/AuditLogs"))
            .default,
        }),
      },
      {
        path: "/enterprise/settings",
        lazy: async () => ({
          Component: (await import("../features/enterprise/pages/Settings"))
            .default,
        }),
      },

      // Shared profile

      {
        path: "/profile",
        lazy: async () => ({
          Component: (await import("../shared/pages/Profile")).default,
        }),
      },
    ],
  },

  // Utility pages

  {
    path: "/maintenance",
    element: <UtilityPage code="503" title="Under maintenance" />,
  },
  {
    path: "/access-denied",
    element: <UtilityPage code="403" title="Access denied" />,
  },
  {
    path: "/server-error",
    element: <UtilityPage code="500" title="Server error" />,
  },
  {
    path: "*",
    element: <UtilityPage code="404" title="Page not found" />,
  },
]);
