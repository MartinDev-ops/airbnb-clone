import { useNavigate } from "react-router-dom";
import { getDisplayRating } from "../utils/displayRating";

/**
 * Horizontal listing card used on the Locations (search results) page:
 * image left, details right (type, name, amenities, rating, price).
 */
export default function ListingCard({ listing }) {
  const navigate = useNavigate();
  const { rating, reviews } = getDisplayRating(listing);

  return (
    <div className="listing-card" onClick={() => navigate(`/locations/${listing._id}`)}>
      <img src={listing.images?.[0]} alt={listing.title} />
      <div className="listing-body">
        <span className="listing-type">{listing.type}</span>
        <h3 className="listing-title">{listing.title}</h3>
        <p className="listing-meta">
          {listing.guests} guests &middot; {listing.type} &middot; {listing.bedrooms} bedrooms &middot;{" "}
          {listing.bathrooms} bathrooms
        </p>
        <p className="listing-meta">{listing.amenities?.join(" · ")}</p>
        <div className="listing-footer">
          <span>
            &#9733; {rating.toFixed(1)} ({reviews} reviews)
          </span>
          <span className="listing-price">
            ${listing.price} <span>/ night</span>
          </span>
        </div>
      </div>
    </div>
  );
}
