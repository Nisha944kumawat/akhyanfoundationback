const AuditDocument = require("../models/AuditDocument");
const cloudinary = require("../config/cloudinary");

function cleanFileName(name) {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .toLowerCase();
}

const uploadPdfToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const publicId = `${Date.now()}-${cleanFileName(file.originalname)}.pdf`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "aakhyaan-foundation/audit-documents",
        resource_type: "raw",
        public_id: publicId,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

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

    const uploadedPdf = await uploadPdfToCloudinary(req.file);

    const document = await AuditDocument.create({
      name: req.file.originalname,
      file: uploadedPdf.secure_url,
      public_id: uploadedPdf.public_id,
    });

    res.status(201).json({
      message: "Audit document uploaded successfully",
      document,
    });
  } catch (error) {
    console.log("UPLOAD AUDIT DOCUMENT ERROR:", error);

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

    if (document.public_id) {
      await cloudinary.uploader.destroy(document.public_id, {
        resource_type: "raw",
      });
    }

    await document.deleteOne();

    res.status(200).json({
      message: "Audit document deleted successfully",
    });
  } catch (error) {
    console.log("DELETE AUDIT DOCUMENT ERROR:", error);

    res.status(500).json({
      message: "Audit document delete failed",
      error: error.message,
    });
  }
};