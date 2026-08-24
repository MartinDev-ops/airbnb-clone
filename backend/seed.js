/**
 * Populates the database with demo hosts, a guest user, and a handful of
 * listings so the app has something to show immediately after setup.
 * Run with: npm run seed
 */
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Accommodation = require("./models/Accommodation");
const Reservation = require("./models/Reservation");

const demoImages = [
  "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
];

async function seed() {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Accommodation.deleteMany({}),
    Reservation.deleteMany({}),
  ]);

  console.log("Creating users...");
  const johann = await User.create({ username: "Johann", password: "password123", role: "host" });
  const marie = await User.create({ username: "Marie", password: "password123", role: "host" });
  await User.create({ username: "Jane", password: "password123", role: "user" });

  console.log("Creating listings...");
  const listings = [
    {
      title: "Modern Apartment in New York",
      location: "New York",
      type: "Entire apartment",
      description:
        "Stay in the heart of New York City in this modern apartment, close to popular attractions and equipped with all the amenities you need for a comfortable stay. With its spacious layout and stylish decor, you'll feel right at home. Enjoy easy access to public transportation, making it a breeze to explore the city.",
      images: demoImages,
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["wifi", "kitchen", "free parking"],
      price: 320,
      weeklyDiscount: 0,
      cleaningFee: 50,
      serviceFee: 50,
      occupancyTaxes: 30,
      enhancedCleaning: true,
      selfCheckIn: true,
      rating: 4.5,
      reviews: 320,
      specificRatings: { cleanliness: 4.8, communication: 4.7, checkIn: 4.9, accuracy: 4.6, location: 4.9, value: 4.5 },
      host: johann._id,
    },
    {
      title: "Charming Home in Paris",
      location: "Paris",
      type: "Entire home",
      description:
        "A charming home just steps from the Eiffel Tower with beautiful views and a cozy, art-filled interior. Perfect for a romantic getaway or a family exploring the city.",
      images: demoImages,
      guests: 6,
      bedrooms: 3,
      bathrooms: 3,
      amenities: ["wifi", "kitchen", "free parking"],
      price: 400,
      weeklyDiscount: 40,
      cleaningFee: 60,
      serviceFee: 55,
      occupancyTaxes: 35,
      enhancedCleaning: true,
      selfCheckIn: false,
      rating: 4.7,
      reviews: 250,
      specificRatings: { cleanliness: 4.9, communication: 4.8, checkIn: 4.6, accuracy: 4.7, location: 5.0, value: 4.6 },
      host: marie._id,
    },
    {
      title: "Cozy Private Room in Tokyo",
      location: "Tokyo",
      type: "Private room",
      description:
        "A cozy private room in a traditional Tokyo neighbourhood, minutes from Shibuya Crossing. Great for solo travellers who want an authentic local experience.",
      images: demoImages,
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["wifi", "kitchen"],
      price: 150,
      weeklyDiscount: 15,
      cleaningFee: 25,
      serviceFee: 20,
      occupancyTaxes: 12,
      enhancedCleaning: false,
      selfCheckIn: true,
      rating: 4.2,
      reviews: 180,
      specificRatings: { cleanliness: 4.3, communication: 4.4, checkIn: 4.5, accuracy: 4.2, location: 4.6, value: 4.4 },
      host: johann._id,
    },
    {
      title: "Whole Villa in Los Angeles",
      location: "Los Angeles",
      type: "Whole Villa",
      description: "A spacious villa with a pool, perfect for groups and family trips.",
      images: demoImages,
      guests: 3,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ["Test", "Test"],
      price: 800,
      weeklyDiscount: 0,
      cleaningFee: 80,
      serviceFee: 70,
      occupancyTaxes: 40,
      enhancedCleaning: true,
      selfCheckIn: true,
      rating: 4.0,
      reviews: 200,
      specificRatings: { cleanliness: 4.1, communication: 4.0, checkIn: 4.2, accuracy: 4.0, location: 4.3, value: 3.9 },
      host: marie._id,
    },
    {
      title: "Table Mountain View Stay",
      location: "Cape Town",
      type: "Entire apartment",
      description: "Wake up to views of Table Mountain in this bright, modern apartment.",
      images: demoImages,
      guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ["wifi", "kitchen", "free parking"],
      price: 220,
      weeklyDiscount: 20,
      cleaningFee: 40,
      serviceFee: 35,
      occupancyTaxes: 18,
      enhancedCleaning: true,
      selfCheckIn: true,
      rating: 4.6,
      reviews: 210,
      specificRatings: { cleanliness: 4.7, communication: 4.6, checkIn: 4.8, accuracy: 4.5, location: 4.9, value: 4.6 },
      host: johann._id,
    },
  ];

  await Accommodation.insertMany(listings);

  console.log("Seed complete. Demo host logins:");
  console.log("  username: Johann  password: password123");
  console.log("  username: Marie   password: password123");
  console.log("Demo guest login:");
  console.log("  username: Jane    password: password123");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
