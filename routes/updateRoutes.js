const express = require("express");
const {
  getUpdates,
  createUpdate,
  updateUpdate,
  deleteUpdate,
} = require("../controllers/updateController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getUpdates);
router.post("/", protectAdmin, upload.single("image"), createUpdate);
router.put("/:id", protectAdmin, upload.single("image"), updateUpdate);
router.delete("/:id", protectAdmin, deleteUpdate);

module.exports = router;