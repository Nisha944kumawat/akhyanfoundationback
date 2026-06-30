const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
} = require("../controllers/galleryAdminController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/gallery");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.get("/", getGalleryImages);
router.post("/", protectAdmin, upload.single("image"), uploadGalleryImage);
router.delete("/:id", protectAdmin, deleteGalleryImage);

module.exports = router;