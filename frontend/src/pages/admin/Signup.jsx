import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Signup page. Lets a new visitor create an account as either a guest
 * ("user") or a host, then logs them straight in (register already
 * returns a JWT) and routes the same way Login does.
 */
export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter a username and a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const newUser = await register(username.trim(), password, role);
      if (newUser.role === "host") {
        navigate(redirect || "/admin/listings", { replace: true });
      } else {
        navigate(redirect || "/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <h1>Create an account</h1>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Confirm password</label>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>I'm signing up to</label>
          <div className="auth-role-options">
            <label className="auth-role-option">
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={() => setRole("user")}
              />
              Book stays
            </label>
            <label className="auth-role-option">
              <input
                type="radio"
                name="role"
                value="host"
                checked={role === "host"}
                onChange={() => setRole("host")}
              />
              Host my place
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-admin btn-block" style={{ marginTop: 20 }} disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="auth-links">
        Already have an account?{" "}
        <Link to={redirect ? `/admin/login?redirect=${encodeURIComponent(redirect)}` : "/admin/login"}>
          Log in
        </Link>
      </p>
    </div>
  );
}
