import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps pages that require an authenticated user. Pass `requireHost` for
 * host-only admin pages (Create/View/Update Listing); without it, any
 * logged-in user (guest or host) is let through — e.g. "View reservations"
 * is shared by both, just showing different data per role.
 */
export default function ProtectedRoute({ children, requireHost = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loading">Loading...</div>;
  if (!user || (requireHost && user.role !== "host")) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
