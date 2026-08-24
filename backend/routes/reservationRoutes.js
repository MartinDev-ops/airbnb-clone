const express = require("express");
const {
  createReservation,
  getReservationsByHost,
  getReservationsByUser,
  deleteReservation,
} = require("../controllers/reservationController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/", requireAuth, createReservation);
router.get("/host", requireAuth, getReservationsByHost);
router.get("/user", requireAuth, getReservationsByUser);
router.delete("/:id", requireAuth, deleteReservation);

module.exports = router;
