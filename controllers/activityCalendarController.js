const ActivityCalendar = require("../models/ActivityCalendar");
const fs = require("fs");
const path = require("path");

exports.getActivityCalendarImages = async (req, res) => {
  try {
    const images = await ActivityCalendar.find().sort({ createdAt: 1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
};

exports.uploadActivityCalendarImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const imagePath = `/uploads/activity-calendar/${req.file.filename}`;

    const image = await ActivityCalendar.create({
      image: imagePath,
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      image,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload image" });
  }
};

exports.deleteActivityCalendarImage = async (req, res) => {
  try {
    const image = await ActivityCalendar.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const filePath = path.join(__dirname, "..", image.image);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await image.deleteOne();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete image" });
  }
};