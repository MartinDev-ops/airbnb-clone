const mongoose = require("mongoose");

/**
 * Accommodation model.
 * Field names follow the "Recommended Reservation Data Structure" shown in
 * the project brief for the Location Details page, so the frontend can be
 * built directly against it (images, cost breakdown fields, specificRatings).
 */
const specificRatingsSchema = new mongoose.Schema(
  {
    cleanliness: { type: Number, default: 4.5, min: 0, max: 5 },
    communication: { type: Number, default: 4.5, min: 0, max: 5 },
    checkIn: { type: Number, default: 4.5, min: 0, max: 5 },
    accuracy: { type: Number, default: 4.5, min: 0, max: 5 },
    location: { type: Number, default: 4.5, min: 0, max: 5 },
    value: { type: Number, default: 4.5, min: 0, max: 5 },
  },
  { _id: false }
);

const accommodationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    type: { type: String, required: true }, // e.g. "Entire apartment"
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "A listing can have at most 10 images.",
      },
    },
    // Photo for the "Where you'll sleep" section. Empty string means the
    // host hasn't uploaded one, in which case the frontend shows nothing.
    bedroomImage: { type: String, default: "" },
    guests: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    amenities: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 }, // price per night
    weeklyDiscount: { type: Number, default: 0, min: 0 },
    cleaningFee: { type: Number, default: 0, min: 0 },
    serviceFee: { type: Number, default: 0, min: 0 },
    occupancyTaxes: { type: Number, default: 0, min: 0 },
    enhancedCleaning: { type: Boolean, default: false },
    selfCheckIn: { type: Boolean, default: false },
    freeCancellationDate: { type: Date },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    specificRatings: { type: specificRatingsSchema, default: () => ({}) },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// getAccommodations sorts by createdAt; without this index, Mongo has to
// load the whole collection into memory to sort it, which blows past its
// 32MB in-memory sort limit once listings carry base64-encoded photos.
accommodationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Accommodation", accommodationSchema);
