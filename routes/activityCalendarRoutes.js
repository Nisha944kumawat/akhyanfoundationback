const express = require("express");

const {
  getActivityCalendarImages,
  uploadActivityCalendarImage,
  deleteActivityCalendarImage,
} = require("../controllers/activityCalendarController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getActivityCalendarImages);
router.post("/", protectAdmin, upload.single("image"), uploadActivityCalendarImage);
router.delete("/:id", protectAdmin, deleteActivityCalendarImage);

module.exports = router;