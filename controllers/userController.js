// Updated userController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// Get profile by id
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("favourites");
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json(user);
});

// Get by email
exports.getUserByEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).populate(
    "favourites"
  );
  if (!user) return res.status(404).json({ msg: "Not found" });
  res.json(user);
});

// Update (only self or admin)
exports.updateUser = asyncHandler(async (req, res) => {
  const { name, email, location, website, bio } = req.body;

  const updates = {
    name,
    email,
    // Add the additional fields
    location: location || "",
    website: website || "",
    bio: bio || "",
  };

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  res.json(user);
});

// Delete (self)
exports.deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ msg: "User removed" });
});
