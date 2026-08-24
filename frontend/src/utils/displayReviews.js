/**
 * Individual review cards (name, date, avatar, comment) shown under the
 * rating breakdown. Real reviews aren't implemented yet, so this is a
 * static pool that gets deterministically assigned per listing (seeded by
 * the listing's own id, like displayRating.js) — same listing always shows
 * the same 6 reviewers, different listings get a different set.
 */
const REVIEW_POOL = [
  { name: "Alice", date: "March 2023", avatar: "https://randomuser.me/api/portraits/women/12.jpg", comment: "Amazing place, very clean and well-located." },
  { name: "Bob", date: "February 2023", avatar: "https://randomuser.me/api/portraits/men/32.jpg", comment: "Great communication with the host and easy check-in process." },
  { name: "Carol", date: "January 2023", avatar: "https://randomuser.me/api/portraits/women/45.jpg", comment: "The apartment was exactly as described. Highly recommend." },
  { name: "Dave", date: "December 2022", avatar: "https://randomuser.me/api/portraits/men/51.jpg", comment: "Fantastic stay! The location is perfect." },
  { name: "Eve", date: "November 2022", avatar: "https://randomuser.me/api/portraits/women/68.jpg", comment: "Very clean and spacious. Would definitely come back." },
  { name: "Frank", date: "October 2022", avatar: "https://randomuser.me/api/portraits/men/77.jpg", comment: "Excellent value for the price. Loved the neighborhood." },
  { name: "Grace", date: "September 2022", avatar: "https://randomuser.me/api/portraits/women/23.jpg", comment: "Beautiful photos and it looked even better in person." },
  { name: "Henry", date: "August 2022", avatar: "https://randomuser.me/api/portraits/men/15.jpg", comment: "Quiet, comfortable, and close to everything we wanted to see." },
  { name: "Isla", date: "July 2022", avatar: "https://randomuser.me/api/portraits/women/54.jpg", comment: "Host was super responsive and gave great local recommendations." },
  { name: "Jack", date: "June 2022", avatar: "https://randomuser.me/api/portraits/men/61.jpg", comment: "Bed was comfy and the place was spotless when we arrived." },
  { name: "Karin", date: "May 2022", avatar: "https://randomuser.me/api/portraits/women/33.jpg", comment: "Perfect for a weekend trip. Would stay again in a heartbeat." },
  { name: "Liam", date: "April 2022", avatar: "https://randomuser.me/api/portraits/men/8.jpg", comment: "Check-in was seamless and the space had everything we needed." },
  { name: "Mia", date: "March 2022", avatar: "https://randomuser.me/api/portraits/women/76.jpg", comment: "Cozy and stylish, exactly what the photos promised." },
  { name: "Noah", date: "February 2022", avatar: "https://randomuser.me/api/portraits/men/44.jpg", comment: "Great value, and the host went above and beyond to help us out." },
  { name: "Olivia", date: "January 2022", avatar: "https://randomuser.me/api/portraits/women/9.jpg", comment: "Loved the neighborhood, so many great cafes within walking distance." },
  { name: "Peter", date: "December 2021", avatar: "https://randomuser.me/api/portraits/men/29.jpg", comment: "Solid stay overall, would recommend to friends and family." },
  { name: "Quinn", date: "November 2021", avatar: "https://randomuser.me/api/portraits/women/61.jpg", comment: "Everything was as described, no surprises, just a great stay." },
  { name: "Ravi", date: "October 2021", avatar: "https://randomuser.me/api/portraits/men/71.jpg", comment: "Really well thought out space, comfortable and quiet at night." },
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Seeded PRNG (mulberry32) so the shuffle is deterministic per listing but
// well distributed — a simple rotating window on the pool collides too
// often (two listings can land on the same start index).
function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getDisplayReviews(listing) {
  const seed = hashString(listing._id || listing.title || "");
  const random = mulberry32(seed);
  const shuffled = [...REVIEW_POOL];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 6);
}
