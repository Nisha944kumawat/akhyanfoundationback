const express = require("express");

const {
  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
} = require("../controllers/galleryAdminController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getGalleryImages);
router.post("/", protectAdmin, upload.single("image"), uploadGalleryImage);
router.delete("/:id", protectAdmin, deleteGalleryImage);

module.exports = router;