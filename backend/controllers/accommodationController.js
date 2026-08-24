const Accommodation = require("../models/Accommodation");

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

    const accommodations = await Accommodation.find(filter)
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
    const accommodation = await Accommodation.create({
      ...req.body,
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
