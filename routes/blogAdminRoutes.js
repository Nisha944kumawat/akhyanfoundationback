const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getBlogImages,
  uploadBlogImage,
  deleteBlogImage,
} = require("../controllers/blogAdminController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads", "blog");

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

router.get("/", getBlogImages);
router.post("/", protectAdmin, upload.single("image"), uploadBlogImage);
router.delete("/:id", protectAdmin, deleteBlogImage);

module.exports = router;