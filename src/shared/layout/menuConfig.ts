export type Role = "user" | "zone" | "enterprise";

interface MenuItem {
  label: string;
  path: string;
}

export const menuConfig: Record<Role, MenuItem[]> = {
  user: [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Bills & Payments", path: "/user/bills" },
    { label: "Meter Data", path: "/user/meter-data" },
    { label: "Alerts", path: "/user/alerts" },
  ],

  zone: [
    { label: "Dashboard", path: "/zone/dashboard" },
    { label: "Meter Management", path: "/zone/meters" },
    { label: "User Management", path: "/zone/users" },
    { label: "Reports & Analytics", path: "/zone/reports" },
    { label: "Alerts", path: "/zone/alerts" },
    { label: "Settings", path: "/zone/settings" },
  ],

  enterprise: [
    { label: "Dashboard", path: "/enterprise/dashboard" },
    { label: "Zone Management", path: "/enterprise/zones" },
    { label: "Meter Management", path: "/enterprise/meters" },
    { label: "User & Role Management", path: "/enterprise/users" },
    { label: "Reports & Analytics", path: "/enterprise/reports" },
    { label: "Alerts", path: "/enterprise/alerts" },
    { label: "Audit Logs", path: "/enterprise/audit-logs" },
    { label: "Settings", path: "/enterprise/settings" },
  ],
};
