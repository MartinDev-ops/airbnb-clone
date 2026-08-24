import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BrandMark, MenuIcon } from "./Icons";

/**
 * Header used across the admin dashboard pages (Create/View/Update Listing,
 * View Reservations). Matches the video: logo top-left, "Welcome, <name>"
 * + profile icon top-right, and a row of pill nav buttons underneath.
 */
export default function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="admin-header">
      <div className="container">
        <div className="header-row">
          <Link to="/" className="brand">
            <BrandMark />
            airbnb
          </Link>
          <div className="header-actions">
            {user && <span>Welcome, {user.username}</span>}
            <div className="account-menu">
              <button
                className="account-trigger"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Account menu"
              >
                <MenuIcon width={16} height={16} />
                <span className="avatar-circle">{user ? user.username[0].toUpperCase() : "?"}</span>
              </button>
              {menuOpen && (
                <div className="account-dropdown" onMouseLeave={() => setMenuOpen(false)}>
                  <Link to="/" onClick={() => setMenuOpen(false)}>
                    Back to site
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate("/admin/login");
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <Link to="/admin/reservations" className={pathname === "/admin/reservations" ? "active" : ""}>
            View Reservations
          </Link>
          <Link to="/admin/listings" className={pathname === "/admin/listings" ? "active" : ""}>
            View Listings
          </Link>
          <Link to="/admin/listings/new" className={pathname === "/admin/listings/new" ? "active" : ""}>
            Create Listing
          </Link>
        </nav>
      </div>
    </header>
  );
}
