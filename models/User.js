const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false, // don’t return by default
    },
    location: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FavouriteCountry",
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// hash before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// helper to match password
userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

// generate JWT
userSchema.methods.getSignedJwtToken = function () {
  const jwt = require("jsonwebtoken");
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// generate & hash reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
