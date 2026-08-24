const Reservation = require("../models/Reservation");
const Accommodation = require("../models/Accommodation");

function nightsBetween(checkIn, checkOut) {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

/**
 * POST /api/reservations
 * Recomputes the price breakdown server-side from the listing's own fees
 * so a tampered client request can't change the charged amount.
 */
async function createReservation(req, res) {
  try {
    const { accommodationId, checkIn, checkOut, guests } = req.body;

    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ message: "Listing not found." });
    }
    if (guests > accommodation.guests) {
      return res.status(400).json({ message: `This listing sleeps at most ${accommodation.guests} guests.` });
    }

    const nights = nightsBetween(checkIn, checkOut);
    const subtotal = accommodation.price * nights;
    const weeklyDiscount = nights >= 7 ? accommodation.weeklyDiscount : 0;
    const total =
      subtotal - weeklyDiscount + accommodation.cleaningFee + accommodation.serviceFee + accommodation.occupancyTaxes;

    const reservation = await Reservation.create({
      accommodation: accommodation._id,
      host: accommodation.host,
      user: req.user.id,
      checkIn,
      checkOut,
      guests,
      nights,
      priceBreakdown: {
        nightlyRate: accommodation.price,
        weeklyDiscount,
        cleaningFee: accommodation.cleaningFee,
        serviceFee: accommodation.serviceFee,
        occupancyTaxes: accommodation.occupancyTaxes,
        total,
      },
    });

    return res.status(201).json(reservation);
  } catch (err) {
    return res.status(400).json({ message: "Could not create reservation.", error: err.message });
  }
}

/** GET /api/reservations/host - reservations for listings owned by the logged-in host */
async function getReservationsByHost(req, res) {
  try {
    const reservations = await Reservation.find({ host: req.user.id })
      .populate("accommodation", "title location")
      .populate("user", "username")
      .sort({ checkIn: 1 });
    return res.status(200).json(reservations);
  } catch (err) {
    return res.status(500).json({ message: "Could not fetch reservations.", error: err.message });
  }
}

/** GET /api/reservations/user - reservations booked by the logged-in guest */
async function getReservationsByUser(req, res) {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate("accommodation", "title location images")
      .sort({ checkIn: 1 });
    return res.status(200).json(reservations);
  } catch (err) {
    return res.status(500).json({ message: "Could not fetch reservations.", error: err.message });
  }
}

/** DELETE /api/reservations/:id - guest or the listing's host may cancel */
async function deleteReservation(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }
    const isOwner = reservation.user.toString() === req.user.id;
    const isHost = reservation.host.toString() === req.user.id;
    if (!isOwner && !isHost) {
      return res.status(403).json({ message: "You cannot cancel this reservation." });
    }

    await reservation.deleteOne();
    return res.status(200).json({ message: "Reservation cancelled." });
  } catch (err) {
    return res.status(400).json({ message: "Could not cancel reservation.", error: err.message });
  }
}

module.exports = {
  createReservation,
  getReservationsByHost,
  getReservationsByUser,
  deleteReservation,
};
