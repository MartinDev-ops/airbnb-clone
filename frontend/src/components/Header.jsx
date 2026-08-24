import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BrandMark, SearchIcon, GlobeIcon, MenuIcon } from "./Icons";

/**
 * Top header for the public-facing site (Home / Locations / Location
 * Details). Implements brief item 1 "Top Header": logo + nav links, a
 * dynamic search bar, and a greeting/dropdown for logged-in users vs a
 * "Become a host" link for logged-out visitors.
 */
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [guestsPos, setGuestsPos] = useState(null);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const totalGuests = adults + children;
  const guestsTriggerRef = useRef(null);

  function toggleGuests() {
    if (!guestsOpen && guestsTriggerRef.current) {
      const rect = guestsTriggerRef.current.getBoundingClientRect();
      setGuestsPos({ top: rect.bottom + 10, right: window.innerWidth - rect.right });
    }
    setGuestsOpen((v) => !v);
  }

  function goToLocations(searchLocation) {
    const params = new URLSearchParams();
    if (searchLocation && searchLocation !== "all") params.set("location", searchLocation);
    if (totalGuests > 0) params.set("guests", String(totalGuests));
    navigate(`/locations?${params.toString()}`);
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!location) {
      window.alert("Please select a location.");
      return;
    }
    goToLocations(location);
  }

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-row">
          <Link to="/" className="brand">
            <BrandMark />
            airbnb
          </Link>

          <nav className="main-nav">
            <Link to="/">Places to stay</Link>
            <Link to="/">Experiences</Link>
            <Link to="/">Online Experiences</Link>
          </nav>

          <div className="header-actions">
            {user ? (
              <>
                <span>Welcome, {user.username}</span>
                <div className="account-menu">
                  <button
                    className="account-trigger"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Account menu"
                  >
                    <MenuIcon width={16} height={16} />
                    <span className="avatar-circle">{user.username[0].toUpperCase()}</span>
                  </button>
                  {menuOpen && (
                    <div className="account-dropdown" onMouseLeave={() => setMenuOpen(false)}>
                      <Link to="/admin/reservations" onClick={() => setMenuOpen(false)}>
                        View reservations
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                          navigate("/");
                        }}
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/admin/login">Become a host</Link>
                <GlobeIcon className="globe" width={18} height={18} />
                <div className="account-menu">
                  <button
                    className="account-trigger"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Account menu"
                  >
                    <MenuIcon width={16} height={16} />
                    <span className="avatar-circle">?</span>
                  </button>
                  {menuOpen && (
                    <div className="account-dropdown" onMouseLeave={() => setMenuOpen(false)}>
                      <Link to="/admin/login" onClick={() => setMenuOpen(false)}>
                        Log in
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search-field">
            <label>Locations</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="" disabled>
                Select a Location
              </option>
              <option value="all">All Locations</option>
              <option value="New York">New York</option>
              <option value="Paris">Paris</option>
              <option value="Tokyo">Tokyo</option>
              <option value="Cape Town">Cape Town</option>
              <option value="Thailand">Thailand</option>
            </select>
          </div>
          <div className="search-field">
            <label>Check in date</label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div className="search-field">
            <label>Checkout date</label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
          <div className="search-field guests-picker">
            <button
              type="button"
              ref={guestsTriggerRef}
              className="guests-picker-trigger"
              onClick={toggleGuests}
            >
              <label>Guests</label>
              <span className={`guests-picker-value${totalGuests === 0 ? " muted" : ""}`}>
                {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}` : "0 guests"}
              </span>
            </button>
            {guestsOpen &&
              guestsPos &&
              createPortal(
                <div
                  className="guests-dropdown"
                  style={{ top: guestsPos.top, right: guestsPos.right }}
                  onMouseLeave={() => setGuestsOpen(false)}
                >
                  <div className="guests-row">
                    <span>Adults</span>
                    <div className="stepper">
                      <button
                        type="button"
                        disabled={adults === 0}
                        onClick={() => setAdults((v) => Math.max(0, v - 1))}
                        aria-label="Decrease adults"
                      >
                        −
                      </button>
                      <span>{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults((v) => v + 1)}
                        aria-label="Increase adults"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="guests-row">
                    <span>Children</span>
                    <div className="stepper">
                      <button
                        type="button"
                        disabled={children === 0}
                        onClick={() => setChildren((v) => Math.max(0, v - 1))}
                        aria-label="Decrease children"
                      >
                        −
                      </button>
                      <span>{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren((v) => v + 1)}
                        aria-label="Increase children"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )}
          </div>
          <button type="submit" className="search-btn" aria-label="Search">
            <SearchIcon width={15} height={15} />
          </button>
        </form>
      </div>
    </header>
  );
}
