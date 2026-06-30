const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getAuditDocuments,
  uploadAuditDocument,
  deleteAuditDocument,
} = require("../controllers/auditDocumentController");

const uploadPath = path.join(__dirname, "../uploads/audit-documents");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + safeName);
  },
});

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
});

router.get("/", getAuditDocuments);
router.post("/", upload.single("document"), uploadAuditDocument);
router.delete("/:id", deleteAuditDocument);

module.exports = router;