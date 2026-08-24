const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * POST /api/users/register
 * Convenience endpoint for creating hosts/users while developing & seeding
 * data. Not required by the rubric but makes the app self-contained.
 */
async function register(req, res) {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "That username is already taken." });
    }

    const user = await User.create({ username, password, role });
    const token = signToken(user);
    return res.status(201).json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: "Could not create user.", error: err.message });
  }
}

/**
 * POST /api/users/login
 * Validates credentials and returns a signed JWT + the user's profile.
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = signToken(user);
    return res.status(200).json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: "Login failed.", error: err.message });
  }
}

/**
 * GET /api/users/me
 * Returns the profile of the currently authenticated user (requires JWT).
 */
async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Could not fetch profile.", error: err.message });
  }
}

module.exports = { register, login, getMe };
