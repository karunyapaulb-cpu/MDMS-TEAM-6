import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="auth-page">
      <form
        className="auth-card"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        {!sent ? (
          <>
            <h2>Forgot password</h2>

            <label>Email address</label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button>Send reset link</button>
          </>
        ) : (
          <>
            <h2>Check your email</h2>
            <p>Reset link requested for {email}.</p>
            <small>Demo only. No email has been sent.</small>

            <button
              type="button"
              onClick={() => setMessage("Demo link requested again")}
            >
              Resend
            </button>

            <p>{message}</p>

            <Link to="/reset-password/demo-token">Open demo reset link</Link>
          </>
        )}

        <Link to="/login">Back to Login</Link>
      </form>
    </div>
  );
}
