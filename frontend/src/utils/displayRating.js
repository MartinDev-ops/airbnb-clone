/**
 * Real hosts have no way to set rating/reviews yet, so every listing sits
 * at 0. This derives a plausible, stable-per-listing rating and review
 * count (seeded from the listing's own id) purely for display, without
 * touching the actual stored data.
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDisplayRating(listing) {
  if (listing.reviews > 0) {
    return { rating: listing.rating, reviews: listing.reviews };
  }
  const seed = hashString(listing._id || listing.title || "");
  const rating = Math.round((4.3 + (seed % 71) / 100) * 10) / 10; // 4.3–5.0
  const reviews = 8 + (seed % 335); // 8–342
  return { rating, reviews };
}
