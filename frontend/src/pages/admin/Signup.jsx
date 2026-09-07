import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

const PASSWORD_REQUIREMENTS = [
  { id: "number", label: "At least 1 number", test: (pw) => /[0-9]/.test(pw) },
  { id: "upper", label: "At least 1 upper case letter", test: (pw) => /[A-Z]/.test(pw) },
  { id: "special", label: "At least 1 special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordTooLong = password.length > PASSWORD_MAX_LENGTH;
  const lengthCheck = {
    id: "length",
    label: passwordTooLong
      ? `You've exceeded the ${PASSWORD_MAX_LENGTH} character limit`
      : `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
    met: password.length >= PASSWORD_MIN_LENGTH && !passwordTooLong,
    exceeded: passwordTooLong,
  };
  const passwordChecks = [
    lengthCheck,
    ...PASSWORD_REQUIREMENTS.map((req) => ({ ...req, met: req.test(password) })),
  ];
  const passwordMeetsRequirements = passwordChecks.every((c) => c.met);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter a username and a password.");
      return;
    }
    if (!passwordMeetsRequirements) {
      setError("Password does not meet all the requirements below.");
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
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.6 20.6 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a20.6 20.6 0 0 1-3.22 4.5M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <ul className="password-requirements">
            {passwordChecks.map((req) => (
              <li key={req.id} className={req.met ? "met" : req.exceeded ? "exceeded" : ""}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {req.met ? (
                    <polyline points="20 6 9 17 4 12" />
                  ) : req.exceeded ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <circle cx="12" cy="12" r="9" />
                  )}
                </svg>
                {req.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="form-field">
          <label>Confirm password</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              aria-pressed={showConfirmPassword}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.6 20.6 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a20.6 20.6 0 0 1-3.22 4.5M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
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
