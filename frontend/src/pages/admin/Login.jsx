import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Login page (brief item 2 / rubric "Login Page"). Field names match the
 * working reference app shown in the guide video (Username + Password),
 * with client-side validation and a clear error message on failure.
 * Hosts land on the admin dashboard; guests return to wherever they came
 * from (e.g. back to a listing to finish reserving).
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter both a username and a password.");
      return;
    }

    setSubmitting(true);
    try {
      const loggedInUser = await login(username.trim(), password);
      if (loggedInUser.role === "host") {
        navigate(redirect || "/admin/listings", { replace: true });
      } else {
        navigate(redirect || "/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-field">
          <label>Username</label>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <a href="#forgot" className="auth-links" onClick={(e) => e.preventDefault()}>
          Forgot Password?
        </a>

        <button type="submit" className="btn btn-admin btn-block" style={{ marginTop: 20 }} disabled={submitting}>
          {submitting ? "Logging in…" : "Login"}
        </button>
      </form>

      <p className="auth-links">
        Don't have an account?{" "}
        <Link to={redirect ? `/admin/signup?redirect=${encodeURIComponent(redirect)}` : "/admin/signup"}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
