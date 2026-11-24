import { useState } from "react";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <div className="auth-page">
      <form
        className="auth-card"
        onSubmit={(e) => {
          e.preventDefault();

          if (
            password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password)
          ) {
            setError("Use 8 characters, an uppercase letter and a number.");
          } else if (password !== confirm) {
            setError("Passwords do not match.");
          } else {
            setError("");
            setSuccess(true);
          }
        }}
      >
        {success ? (
          <>
            <h2>Password updated</h2>
            <p>Demo validation completed.</p>
            <Link to="/login">Return to Login</Link>
          </>
        ) : (
          <>
            <h2>Reset password</h2>

            <label>New password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Confirm password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <small className="error">{error}</small>

            <button>Update password</button>
          </>
        )}
      </form>
    </div>
  );
}
