const mongoose = require("mongoose");

/**
 * Reservation model - created when a guest reserves an accommodation from
 * the Location Details page's cost calculator.
 */
const reservationSchema = new mongoose.Schema(
  {
    accommodation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    nights: { type: Number, required: true, min: 1 },
    priceBreakdown: {
      nightlyRate: { type: Number, required: true },
      weeklyDiscount: { type: Number, default: 0 },
      cleaningFee: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      occupancyTaxes: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

reservationSchema.pre("validate", function validateDates(next) {
  if (this.checkIn && this.checkOut && this.checkOut <= this.checkIn) {
    return next(new Error("checkOut must be after checkIn."));
  }
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
