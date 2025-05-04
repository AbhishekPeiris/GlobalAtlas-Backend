const router = require("express").Router();
const {
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middlewares/auth");

router.get("/:id", protect, getUserById);
router.get("/email/:email", protect, getUserByEmail);
router.put("/", protect, updateUser);
router.delete("/", protect, deleteUser);

module.exports = router;
