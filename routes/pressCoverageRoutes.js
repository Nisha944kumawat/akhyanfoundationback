const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getPressCoverageImages,
  uploadPressCoverageImage,
  deletePressCoverageImage,
} = require("../controllers/pressCoverageController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads", "press-coverage");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.get("/", getPressCoverageImages);
router.post("/", protectAdmin, upload.single("image"), uploadPressCoverageImage);
router.delete("/:id", protectAdmin, deletePressCoverageImage);

module.exports = router;