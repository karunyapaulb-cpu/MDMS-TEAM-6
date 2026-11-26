import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, Moon, Sun } from "lucide-react";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("mdms-theme") || "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("mdms-theme", theme);
  }, [theme]);

  return (
    <header className="header">
      <button onClick={onMenuClick} aria-label="Toggle menu">
        <Menu />
      </button>

      <strong>Meter Data Management System</strong>

      <div className="header-actions">
        <span className="notification-bell">
          <Bell size={20} /> 3
        </span>

        <button
          aria-label="Switch theme"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </button>

        <select aria-label="Language">
          <option>English</option>
          <option>Kannada</option>
          <option>Hindi</option>
        </select>

        <details>
          <summary>Profile</summary>
          <div className="profile-menu">
            <Link to="/profile">Profile & Settings</Link>
            <Link to="/login">Logout</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
