import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccommodation } from "../api/accommodations";
import { createReservation } from "../api/reservations";
import { useAuth } from "../context/AuthContext";
import AmenityIcon from "../components/AmenityIcon";
import { getDisplayRating } from "../utils/displayRating";
import { getDisplayReviews } from "../utils/displayReviews";

const ratingLabels = {
  cleanliness: "Cleanliness",
  communication: "Communication",
  checkIn: "Check-in",
  accuracy: "Accuracy",
  location: "Location",
  value: "Value",
};

const HOST_JOIN_DATES = ["June 2024", "March 2023", "September 2023", "January 2024", "May 2022"];

function getHostProfile(listing) {
  const seed = (listing.host?._id || listing.host?.username || listing._id || "").length;
  return {
    joined: HOST_JOIN_DATES[seed % HOST_JOIN_DATES.length],
    reviewCount: 180 + ((seed * 37) % 220),
  };
}

const houseRules = [
  { icon: "\u{1F553}", text: "Check-in: After 4:00 PM" },
  { icon: "\u{1F559}", text: "Check-out: 10:00 AM" },
  { icon: "\u{1F510}", text: "Self check-in with lock-box" },
  { icon: "\u{1F476}", text: "Not suitable for infants (under 2 years)" },
  { icon: "\u{1F6AD}", text: "No smoking" },
  { icon: "\u{1F43E}", text: "No pets" },
  { icon: "\u{1F389}", text: "No parties or events" },
];

const healthAndSafety = [
  { icon: "\u{2728}", text: "Committed to Airbnb's enhanced cleaning process.", link: true },
  { icon: "\u{1F637}", text: "Airbnb's social-distancing and other COVID-19-related guidelines apply" },
  { icon: "\u{1F6A8}", text: "Carbon monoxide alarm" },
  { icon: "\u{1F525}", text: "Smoke alarm" },
  { icon: "\u{1F4B3}", text: "Security Deposit - if you damage the home, you may be charged up to $566", link: true },
];

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut) - new Date(checkIn);
  return ms > 0 ? Math.round(ms / (1000 * 60 * 60 * 24)) : 0;
}

const featureCopy = {
  entire: {
    icon: "\u{1F3E0}",
    title: (type) => type,
    body: "You'll have the apartment for yourself",
  },
  cleaning: { icon: "\u{2728}", title: "Enhanced Cleaning:", body: "This Host committed to Airbnb's 5-step enhanced cleaning process." },
  checkIn: { icon: "\u{1F3E2}", title: "Self Check-in:", body: "Check yourself in with the keypad" },
  cancellation: { icon: "\u{1F4C5}", title: "Free cancellation", body: "Cancel before check-in for a partial refund." },
};

export default function LocationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [status, setStatus] = useState("loading");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [reserveError, setReserveError] = useState("");
  const [reserveSuccess, setReserveSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStatus("loading");
    getAccommodation(id)
      .then((data) => {
        setListing(data);
        setGuests(1);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);

  const breakdown = useMemo(() => {
    if (!listing || nights <= 0) return null;
    const subtotal = listing.price * nights;
    const weeklyDiscount = nights >= 7 ? listing.weeklyDiscount : 0;
    const total = subtotal - weeklyDiscount + listing.cleaningFee + listing.serviceFee + listing.occupancyTaxes;
    return { subtotal, weeklyDiscount, total };
  }, [listing, nights]);

  async function handleReserve(e) {
    e.preventDefault();
    setReserveError("");
    setReserveSuccess("");

    if (!user) {
      window.alert("Please log in to reserve this stay.");
      navigate(`/admin/login?redirect=/locations/${id}`);
      return;
    }
    if (!checkIn || !checkOut || nights <= 0) {
      setReserveError("Choose a valid check-in and check-out date.");
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({ accommodationId: id, checkIn, checkOut, guests: Number(guests) });
      setReserveSuccess("Reservation confirmed! You can review it under your reservations.");
    } catch (err) {
      setReserveError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") return <div className="page-loading">Loading listing…</div>;
  if (status === "error" || !listing) return <div className="page-error">Couldn't find that listing.</div>;

  const { rating, reviews } = getDisplayRating(listing);
  const displayReviews = getDisplayReviews(listing);
  const hostProfile = getHostProfile(listing);
  const images = listing.images?.length ? listing.images : Array(5).fill("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800");
  const galleryImages = images.slice(0, 5);
  const [heroImage, ...thumbImages] = galleryImages;

  return (
    <div className="container">
      <div className={`gallery${thumbImages.length === 0 ? " gallery-solo" : ""}`}>
        <div className="gallery-hero-wrap">
          <img className="gallery-hero" src={heroImage} alt={`${listing.title} photo 1`} />
        </div>
        {thumbImages.length > 0 && (
          <div className="gallery-thumbs">
            {thumbImages.map((src, i) => (
              <img key={i} src={src} alt={`${listing.title} photo ${i + 2}`} />
            ))}
          </div>
        )}
      </div>

      <div className="details-layout">
        <div>
          <div className="details-heading">
            <h1>{listing.title}</h1>
            <div className="sub">
              &#9733; {rating.toFixed(1)} ({reviews} reviews) &middot; {listing.location}
            </div>
          </div>

          <div className="host-row">
            <div>
              <h2>{listing.type} hosted by {listing.host?.username || "Host"}</h2>
              <div className="host-meta">
                {listing.guests} guests &middot; {listing.type} &middot; {listing.bedrooms} bedrooms &middot;{" "}
                {listing.bathrooms} bathrooms
              </div>
            </div>
            <div className="avatar-circle" style={{ width: 48, height: 48, fontSize: 18 }}>
              {(listing.host?.username || "H")[0].toUpperCase()}
            </div>
          </div>

          <ul className="feature-list">
            <li>
              <span className="feature-icon">{featureCopy.entire.icon}</span>
              <div>
                <strong>{listing.type}</strong>
                <span>{featureCopy.entire.body}</span>
              </div>
            </li>
            {listing.enhancedCleaning && (
              <li>
                <span className="feature-icon">{featureCopy.cleaning.icon}</span>
                <div>
                  <strong>{featureCopy.cleaning.title}</strong>
                  <span>{featureCopy.cleaning.body}</span>
                </div>
              </li>
            )}
            {listing.selfCheckIn && (
              <li>
                <span className="feature-icon">{featureCopy.checkIn.icon}</span>
                <div>
                  <strong>{featureCopy.checkIn.title}</strong>
                  <span>{featureCopy.checkIn.body}</span>
                </div>
              </li>
            )}
            <li>
              <span className="feature-icon">{featureCopy.cancellation.icon}</span>
              <div>
                <strong>{featureCopy.cancellation.title}</strong>
                <span>{featureCopy.cancellation.body}</span>
              </div>
            </li>
          </ul>

          <p className="details-description">{listing.description}</p>

          <div className="details-static-sections">
            {listing.bedroomImage && (
              <>
                <h3>Where you'll sleep</h3>
                <div className="sleep-card">
                  <img src={listing.bedroomImage} alt="Bedroom" />
                  <div className="sleep-caption">
                    <strong>Spacious bedroom with comfortable bed.</strong>
                    <span>Total bedrooms: {listing.bedrooms}</span>
                  </div>
                </div>
              </>
            )}

            <h3>What this place offers</h3>
            {listing.amenities?.length ? (
              <div className="amenities-grid">
                {listing.amenities.map((amenity) => (
                  <div className="amenity-item" key={amenity}>
                    <AmenityIcon name={amenity} width={20} height={20} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Amenities listed by the host.</p>
            )}

          </div>
        </div>

        <div className="booking-card">
          <div className="booking-price">
            <span>
              <strong>${listing.price}</strong> <span className="unit">/ night</span>
            </span>
            <span className="booking-rating">
              &#9733; {rating.toFixed(1)} ({reviews})
            </span>
          </div>

          <form onSubmit={handleReserve}>
            <div className="date-grid">
              <div>
                <label>Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required={!!user}
                />
              </div>
              <div>
                <label>Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required={!!user}
                />
              </div>
            </div>
            <div className="guests-field">
              <label>Guests</label>
              <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                {Array.from({ length: listing.guests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} guest{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            {reserveError && <div className="form-error">{reserveError}</div>}
            {reserveSuccess && <div className="form-success">{reserveSuccess}</div>}

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Reserving…" : "Reserve"}
            </button>
            <div className="charge-note">You won't be charged yet</div>

            {breakdown && (
              <div className="price-breakdown">
                <div className="row">
                  <span>${listing.price} x {nights} night{nights > 1 ? "s" : ""}</span>
                  <span>${breakdown.subtotal}</span>
                </div>
                <div className="row">
                  <span>Weekly discount</span>
                  <span>-${breakdown.weeklyDiscount}</span>
                </div>
                <div className="row">
                  <span>Cleaning fee</span>
                  <span>${listing.cleaningFee}</span>
                </div>
                <div className="row">
                  <span>Service fee</span>
                  <span>${listing.serviceFee}</span>
                </div>
                <div className="row">
                  <span>Occupancy taxes and fees</span>
                  <span>${listing.occupancyTaxes}</span>
                </div>
                <div className="row total">
                  <span>Total</span>
                  <span>${breakdown.total}</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="reviews-section">
        <h3>Reviews</h3>
        <div className="reviews-summary">
          <span className="reviews-overall">
            &#9733; {rating.toFixed(1)} <span>&middot; {reviews} reviews</span>
          </span>
          {listing.specificRatings && (
            <div className="ratings-grid">
              {Object.entries(ratingLabels).map(([key, label]) => (
                <div className="rating-row" key={key}>
                  <span className="rating-label">{label}</span>
                  <span className="rating-bar">
                    <span
                      className="rating-bar-fill"
                      style={{ width: `${(listing.specificRatings[key] / 5) * 100}%` }}
                    />
                  </span>
                  <span className="rating-score">{listing.specificRatings[key]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="reviews-grid">
          {displayReviews.map((review, i) => (
            <div className="review-card" key={i}>
              <img className="review-avatar" src={review.avatar} alt={review.name} />
              <div>
                <strong className="review-name">{review.name}</strong>
                <span className="review-date">{review.date}</span>
                <p className="review-comment">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-outline show-reviews-btn">
          Show all {reviews} reviews
        </button>

        <div className="host-detail-card">
          <div className="host-detail-heading">
            <div className="avatar-circle" style={{ width: 56, height: 56, fontSize: 20 }}>
              {(listing.host?.username || "H")[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: "0 0 2px" }}>Hosted By {listing.host?.username || "Host"}</h3>
              <span className="host-joined">Joined {hostProfile.joined}</span>
            </div>
          </div>

          <div className="host-badges">
            <span>&#9733; {hostProfile.reviewCount} Reviews</span>
            <span>
              <AmenityIcon name="check" width={14} height={14} /> Identity verified
            </span>
            <span>&#127942; Superhost</span>
          </div>

          <p>
            <strong>{listing.host?.username || "This host"} is a super host</strong>
          </p>
          <p className="host-detail-copy">
            Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
          </p>
          <p className="host-detail-copy">Response rate: 100%</p>
          <p className="host-detail-copy">Response time: within an hour</p>

          <button type="button" className="btn btn-outline">
            Contact Host
          </button>

          <p className="host-safety-note">
            &#128737; To protect your payment, never transfer money or communicate outside of the Airbnb website
            or app.
          </p>
        </div>
      </div>

      <div className="policy-columns">
        <div className="policy-column">
          <h3>House Rules</h3>
          <ul className="policy-list">
            {houseRules.map((rule) => (
              <li key={rule.text}>
                <span className="policy-icon">{rule.icon}</span> {rule.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="policy-column">
          <h3>Health &amp; Safety</h3>
          <ul className="policy-list">
            {healthAndSafety.map((item) => (
              <li key={item.text}>
                <span className="policy-icon">{item.icon}</span> {item.text}
                {item.link && (
                  <>
                    <br />
                    <span className="policy-show-more">Show more</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="policy-column">
          <h3>Cancellation Policy</h3>
          <ul className="policy-list">
            <li>
              Free cancellation before Feb 14
              <br />
              <span className="policy-show-more">Show more</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
