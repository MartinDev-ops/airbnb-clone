require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// --- Middleware ---
const allowedOrigins = (process.env.CLIENT_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);
// Generous cap so base64-encoded image uploads (see ListingForm) aren't
// rejected as "request entity too large" - but NOT Infinity: a listing
// document lives in MongoDB, which hard-caps a single document at 16MB,
// so an uncapped upload can silently produce a document right at that
// ceiling (~15.5MB was observed in practice) that then makes every list
// query slow, since it has to be transferred on every fetch.
app.use(express.json({ limit: "12mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// --- Health check (useful for Heroku / uptime checks) ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// --- API routes ---
app.use("/api/users", userRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/reservations", reservationRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;
