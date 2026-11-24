import { Link } from "react-router-dom";

export default function UtilityPage({
  code,
  title,
}: {
  code: string;
  title: string;
}) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{code}</h1>
        <h2>{title}</h2>
        <Link to="/login">Return to Login</Link>
      </div>
    </div>
  );
}
