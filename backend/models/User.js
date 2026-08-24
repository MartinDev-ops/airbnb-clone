const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User model. `role` distinguishes a regular guest ("user") from a host who
 * can access the admin dashboard ("host"), matching the brief's
 * recommended user data structure.
 */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "host"], default: "user" },
  },
  { timestamps: true }
);

// Hash the password before saving, but only if it changed.
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Never leak the password hash in API responses.
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
