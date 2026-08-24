import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listAccommodations, deleteAccommodation } from "../../api/accommodations";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "../../components/AdminHeader";
import { getDisplayRating } from "../../utils/displayRating";

/**
 * View Listings page (Admin Dashboard brief item 4). Shows only the
 * logged-in host's own listings, with Update / Delete actions on each.
 */
export default function ViewListings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    listAccommodations({ host: user._id })
      .then((data) => {
        setListings(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [user]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteAccommodation(id);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <AdminHeader />
      <div className="container admin-page">
        <h1>My Listings</h1>

        {status === "loading" && <div className="page-loading">Loading your listings…</div>}
        {status === "error" && <div className="page-error">Couldn't load your listings.</div>}
        {status === "ready" && listings.length === 0 && (
          <div className="page-empty">
            You haven't created any listings yet.{" "}
            <a href="/admin/listings/new" onClick={(e) => { e.preventDefault(); navigate("/admin/listings/new"); }}>
              Create your first one
            </a>
            .
          </div>
        )}

        {listings.map((listing) => {
          const { rating, reviews } = getDisplayRating(listing);
          return (
          <div className="admin-list-card" key={listing._id}>
            <div className="admin-actions">
              <button className="btn btn-admin" onClick={() => navigate(`/admin/listings/${listing._id}/edit`)}>
                Update
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(listing._id)}
                disabled={deletingId === listing._id}
              >
                {deletingId === listing._id ? "Deleting…" : "Delete"}
              </button>
            </div>
            <div className="listing-info">
              <span className="listing-type">
                {listing.type} &middot; {listing.location}
              </span>
              <h3 className="listing-title">{listing.title}</h3>
              <p className="listing-meta">
                {listing.guests} guests &middot; {listing.type} &middot; {listing.bedrooms} bedrooms &middot;{" "}
                {listing.bathrooms} bathrooms
              </p>
              <p className="listing-meta">Amenities: {listing.amenities?.join(", ") || "—"}</p>
              <div className="listing-footer">
                <span>
                  &#9733; {rating.toFixed(1)} ({reviews} reviews)
                </span>
                <span className="listing-price">${listing.price}/night</span>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </>
  );
}
