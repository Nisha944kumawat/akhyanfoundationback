const AuditDocument = require("../models/AuditDocument");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

exports.getAuditDocuments = async (req, res) => {
  try {
    const documents = await AuditDocument.find().sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      message: "Audit documents fetch failed",
      error: error.message,
    });
  }
};

exports.uploadAuditDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required",
      });
    }

    const document = await AuditDocument.create({
      name: req.file.originalname,
      file: `${BASE_URL}/uploads/audit-documents/${req.file.filename}`,
    });

    res.status(201).json({
      message: "Audit document uploaded successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Audit document upload failed",
      error: error.message,
    });
  }
};

exports.deleteAuditDocument = async (req, res) => {
  try {
    const document = await AuditDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Audit document not found",
      });
    }

    const fileName = document.file.split("/").pop();
    const filePath = path.join(__dirname, "../uploads/audit-documents", fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await AuditDocument.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Audit document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Audit document delete failed",
      error: error.message,
    });
  }
};