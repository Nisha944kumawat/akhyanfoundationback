const express = require("express");
const {
  getDonateDetails,
  updateDonateDetails,
} = require("../controllers/donateController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getDonateDetails);
router.put("/", protectAdmin, upload.single("qrImage"), updateDonateDetails);

module.exports = router;