const express = require("express");
const {
  getAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
} = require("../controllers/accommodationController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Public - browsing listings never requires a login.
router.get("/", getAccommodations);
router.get("/:id", getAccommodationById);

// Host-only - creating/editing/removing listings requires the JWT + host role.
router.post("/", requireAuth, requireRole("host"), createAccommodation);
router.put("/:id", requireAuth, requireRole("host"), updateAccommodation);
router.delete("/:id", requireAuth, requireRole("host"), deleteAccommodation);

module.exports = router;
