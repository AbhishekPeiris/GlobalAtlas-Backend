const asyncHandler = require("express-async-handler");
const FavouriteCountry = require("../models/FavouriteCountry");

// Add a country to favorites
exports.addFavourite = asyncHandler(async (req, res) => {
  // Check if already exists
  const existingFav = await FavouriteCountry.findOne({
    user: req.user.id,
    countryCode: req.body.countryCode.toUpperCase(),
  });

  if (existingFav) {
    // If it exists but was marked as not added, update it
    if (!existingFav.isAdded) {
      existingFav.isAdded = true;
      await existingFav.save();
      return res.status(200).json(existingFav);
    }
    // If it's already added, just return it
    return res.status(200).json(existingFav);
  }

  // Create new favorite
  const fav = await FavouriteCountry.create({
    user: req.user.id,
    countryCode: req.body.countryCode.toUpperCase(),
    isAdded: true,
  });

  res.status(201).json(fav);
});

// Remove a country from favorites
exports.removeFavourite = asyncHandler(async (req, res) => {
  await FavouriteCountry.findByIdAndDelete(req.params.id);
  res.json({ msg: "Removed" });
});

// Get all user favorites
exports.getUserFavorites = asyncHandler(async (req, res) => {
  const favorites = await FavouriteCountry.find({
    user: req.user.id,
    isAdded: true,
  });

  res.json(favorites);
});
