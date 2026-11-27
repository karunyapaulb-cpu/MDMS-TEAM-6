import { NavLink } from "react-router-dom";
import { menuConfig } from "./menuConfig";
import type { Role } from "./menuConfig";

interface Props {
  role: Role;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ role, open, onClose }: Props) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <h2>MDMS</h2>
      <p>{role.toUpperCase()}</p>

      <nav>
        {menuConfig[role].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
