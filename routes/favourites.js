const router = require("express").Router();
const {
  addFavourite,
  removeFavourite,
  getUserFavorites,
} = require("../controllers/favouriteController");
const { protect } = require("../middlewares/auth");

router.post("/", protect, addFavourite);
router.delete("/:id", protect, removeFavourite);
router.get("/", protect, getUserFavorites);

module.exports = router;
