const Accommodation = require("../models/Accommodation");

const RATING_CATEGORIES = ["cleanliness", "communication", "checkIn", "accuracy", "location", "value"];

// Random-ish rating in a realistic 3.8-5.0 band, rounded to 1 decimal.
function randomRatingValue() {
  return Math.round((3.8 + Math.random() * 1.2) * 10) / 10;
}

// Fills in any category the caller didn't explicitly send, so listings
// created without a ratings breakdown don't all show the same flat 4.5s.
function buildSpecificRatings(input = {}) {
  const ratings = {};
  RATING_CATEGORIES.forEach((key) => {
    ratings[key] = input[key] != null ? input[key] : randomRatingValue();
  });
  return ratings;
}

function averageRating(ratings) {
  const values = Object.values(ratings);
  return Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 10) / 10;
}

/**
 * GET /api/accommodations
 * Supports ?location=New%20York for the search/locations page, and
 * ?host=<id> for the admin "My Listings" page.
 */
async function getAccommodations(req, res) {
  try {
    const filter = {};
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: "i" };
    }
    if (req.query.host) {
      filter.host = req.query.host;
    }

    // List/search views (ListingCard, admin "My Listings") only ever show
    // the first photo and never the description/bedroom photo, so those
    // are excluded here - a listing with several full-size images
    // shouldn't make every search response balloon in size.
    const accommodations = await Accommodation.find(filter, {
      description: 0,
      bedroomImage: 0,
      images: { $slice: 1 },
    })
      .populate("host", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json(accommodations);
  } catch (err) {
    return res.status(500).json({ message: "Could not fetch accommodations.", error: err.message });
  }
}

/** GET /api/accommodations/:id */
async function getAccommodationById(req, res) {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate(
      "host",
      "username"
    );
    if (!accommodation) {
      return res.status(404).json({ message: "Listing not found." });
    }
    return res.status(200).json(accommodation);
  } catch (err) {
    return res.status(400).json({ message: "Invalid listing id.", error: err.message });
  }
}

/** POST /api/accommodations (host only) */
async function createAccommodation(req, res) {
  try {
    const specificRatings = buildSpecificRatings(req.body.specificRatings);
    const accommodation = await Accommodation.create({
      ...req.body,
      specificRatings,
      rating: req.body.rating ?? averageRating(specificRatings),
      host: req.user.id,
    });
    return res.status(201).json(accommodation);
  } catch (err) {
    return res.status(400).json({ message: "Could not create listing.", error: err.message });
  }
}

/** PUT /api/accommodations/:id (host only, must own the listing) */
async function updateAccommodation(req, res) {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: "Listing not found." });
    }
    if (accommodation.host.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own listings." });
    }

    Object.assign(accommodation, req.body);
    await accommodation.save();
    return res.status(200).json(accommodation);
  } catch (err) {
    return res.status(400).json({ message: "Could not update listing.", error: err.message });
  }
}

/** DELETE /api/accommodations/:id (host only, must own the listing) */
async function deleteAccommodation(req, res) {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ message: "Listing not found." });
    }
    if (accommodation.host.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own listings." });
    }

    await accommodation.deleteOne();
    return res.status(200).json({ message: "Listing deleted." });
  } catch (err) {
    return res.status(400).json({ message: "Could not delete listing.", error: err.message });
  }
}

module.exports = {
  getAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
};
