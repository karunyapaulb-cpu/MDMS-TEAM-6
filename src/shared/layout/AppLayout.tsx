import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import type { Role } from "./menuConfig";

export default function AppLayout() {
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const firstSegment = location.pathname.split("/")[1];

  const role: Role =
    firstSegment === "zone" ||
    firstSegment === "enterprise" ||
    firstSegment === "user"
      ? firstSegment
      : (sessionStorage.getItem("mdms-role") as Role) || "user";

  useEffect(() => {
    sessionStorage.setItem("mdms-role", role);
  }, [role]);

  return (
    <div className="app-layout">
      <Sidebar role={role} open={open} onClose={() => setOpen(false)} />

      <div className="main-area">
        <Header onMenuClick={() => setOpen(!open)} />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
