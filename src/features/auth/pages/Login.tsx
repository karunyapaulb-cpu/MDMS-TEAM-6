import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  return (
    <div className="auth-page">
      <form
        className="auth-card"
        onSubmit={handleSubmit(() => {
          setMessage(
            "Validation successful. Select a demo role below."
          );
        })}
      >
        <h1>MDMS</h1>
        <h2>Welcome back</h2>

        <label>Email</label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
        />
        <small className="error">{errors.email?.message}</small>

        <label>Password</label>
        <input
          type={show ? "text" : "password"}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Minimum 8 characters",
            },
          })}
        />

        <small className="error">
          {errors.password?.message}
        </small>

        <button type="button" onClick={() => setShow(!show)}>
          {show ? "Hide password" : "Show password"}
        </button>

        <label>
          <input type="checkbox" {...register("remember")} />
          Remember me
        </label>

        <Link to="/forgot-password">Forgot password?</Link>

        <button type="submit">Login</button>

        {message && <p>{message}</p>}

        <hr />

        <p>Phase 1 – Demo role switcher</p>

        <Link to="/user/dashboard">End-user</Link>
        <Link to="/zone/dashboard">Zone admin</Link>
        <Link to="/enterprise/dashboard">Enterprise</Link>
      </form>
    </div>
  );
}