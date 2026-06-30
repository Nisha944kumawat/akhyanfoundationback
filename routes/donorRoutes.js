const express = require("express");
const multer = require("multer");

const {
  getDonors,
  addDonor,
  deleteDonor,
} = require("../controllers/donorController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", getDonors);
router.post("/", protectAdmin, upload.single("photo"), addDonor);
router.delete("/:id", protectAdmin, deleteDonor);

module.exports = router;