const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} = require("../controllers/adminController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", protectAdmin, getAdminProfile);

module.exports = router;