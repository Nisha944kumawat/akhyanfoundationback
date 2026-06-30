const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getActivityCalendarImages,
  uploadActivityCalendarImage,
  deleteActivityCalendarImage,
} = require("../controllers/activityCalendarController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/activity-calendar");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.get("/", getActivityCalendarImages);
router.post("/", protectAdmin, upload.single("image"), uploadActivityCalendarImage);
router.delete("/:id", protectAdmin, deleteActivityCalendarImage);

module.exports = router;