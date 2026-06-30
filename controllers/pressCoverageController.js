const PressCoverage = require("../models/PressCoverage");
const fs = require("fs");
const path = require("path");

exports.getPressCoverageImages = async (req, res) => {
  try {
    const images = await PressCoverage.find().sort({ createdAt: 1 });
    res.status(200).json(images);
  } catch (error) {
    console.log("GET PRESS COVERAGE ERROR:", error);
    res.status(500).json({ message: "Failed to fetch press coverage images" });
  }
};

exports.uploadPressCoverageImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const imagePath = `/uploads/press-coverage/${req.file.filename}`;

    const image = await PressCoverage.create({
      image: imagePath,
    });

    res.status(201).json({
      message: "Press coverage image uploaded successfully",
      image,
    });
  } catch (error) {
    console.log("UPLOAD PRESS COVERAGE ERROR:", error);
    res.status(500).json({
      message: "Failed to upload press coverage image",
      error: error.message,
    });
  }
};

exports.deletePressCoverageImage = async (req, res) => {
  try {
    const image = await PressCoverage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Press coverage image not found" });
    }

    const filePath = path.join(__dirname, "..", image.image);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await image.deleteOne();

    res.status(200).json({ message: "Press coverage image deleted successfully" });
  } catch (error) {
    console.log("DELETE PRESS COVERAGE ERROR:", error);
    res.status(500).json({ message: "Failed to delete press coverage image" });
  }
};