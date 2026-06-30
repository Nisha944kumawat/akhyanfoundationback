const express = require("express");

const {
  getBlogImages,
  uploadBlogImage,
  deleteBlogImage,
} = require("../controllers/blogAdminController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getBlogImages);
router.post("/", protectAdmin, upload.single("image"), uploadBlogImage);
router.delete("/:id", protectAdmin, deleteBlogImage);

module.exports = router;