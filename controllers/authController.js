const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  // welcome mail
  await sendEmail({
    email: user.email,
    subject: "Welcome to Country API",
    message: `<p>Hi ${user.name}, thanks for signing up! 🎉</p>`,
  });

  sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ msg: "Invalid credentials" });
  sendTokenResponse(user, 200, res);
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ msg: "No user with that email" });

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    email: user.email,
    subject: "Password reset",
    message: `<p>Reset your password <a href="${resetUrl}">here</a>. </p>`,
  });

  res.json({ msg: "Email sent" });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// helper
const sendTokenResponse = (user, code, res) => {
  const token = user.getSignedJwtToken();
  res.status(code).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
};
