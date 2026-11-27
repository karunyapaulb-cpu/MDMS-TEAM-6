import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

document.documentElement.dataset.theme =
  localStorage.getItem("mdms-theme") || "light";

  textarea {
  font: inherit;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px;
  min-height: 100px;
}

button[type="submit"] {
  background: #2563eb;
  color: white;
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filter-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .filter-bar input,
  .filter-bar select {
    width: 100%;
  }

  .welcome-banner {
    flex-direction: column;
  }

  .table-card,
  .chart-card {
    padding: 12px;
  }

  .header {
    padding: 12px;
  }
}