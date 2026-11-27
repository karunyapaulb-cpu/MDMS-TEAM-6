import { Link, useNavigate } from "react-router-dom";

interface Props {
  code: string;
  title: string;
}

export default function UtilityPage({ code, title }: Props) {
  const navigate = useNavigate();

  const descriptions: Record<string, string> = {
    "404": "The page you requested could not be found.",
    "500": "Something went wrong while loading the application.",
    "503": "MDMS is temporarily unavailable for maintenance.",
    "403": "You do not have permission to access this page.",
  };

  return (
    <div className="auth-page">
      <section className="auth-card" style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "70px", margin: 0 }}>{code}</h1>

        <h2>{title}</h2>

        <p>{descriptions[code]}</p>

        <button onClick={() => navigate(-1)}>Go back</button>

        <Link to="/login">Return to Login</Link>
      </section>
    </div>
  );
}
