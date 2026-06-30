const Gallery = require("../models/Gallery");
const fs = require("fs");
const path = require("path");

exports.getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: 1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gallery images" });
  }
};

exports.uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const imagePath = `/uploads/gallery/${req.file.filename}`;

    const image = await Gallery.create({
      image: imagePath,
    });

    res.status(201).json({
      message: "Gallery image uploaded successfully",
      image,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload gallery image" });
  }
};

exports.deleteGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    const filePath = path.join(__dirname, "..", image.image);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await image.deleteOne();

    res.status(200).json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete gallery image" });
  }
};