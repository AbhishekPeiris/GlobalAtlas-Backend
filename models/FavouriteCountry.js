const mongoose = require("mongoose");
const favouriteCountrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    countryCode: {
      type: String,
      minlength: 2,
      maxlength: 3,
      required: true,
    },
    isAdded: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FavouriteCountry", favouriteCountrySchema);
