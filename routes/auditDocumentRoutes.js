const express = require("express");
const multer = require("multer");

const {
  getAuditDocuments,
  uploadAuditDocument,
  deleteAuditDocument,
} = require("../controllers/auditDocumentController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.get("/", getAuditDocuments);
router.post("/", protectAdmin, upload.single("document"), uploadAuditDocument);
router.delete("/:id", protectAdmin, deleteAuditDocument);

module.exports = router;