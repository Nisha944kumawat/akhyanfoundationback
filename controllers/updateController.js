const Update = require("../models/Update");
const fs = require("fs");
const path = require("path");

exports.getUpdates = async (req, res) => {
  try {
    const updates = await Update.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUpdate = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const update = await Update.create({
      title,
      description,
      date,
      image: imagePath,
    });

    res.status(201).json(update);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUpdate = async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);

    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }

    update.title = req.body.title || update.title;
    update.description = req.body.description || update.description;
    update.date = req.body.date || update.date;

    if (req.file) {
      update.image = `/uploads/${req.file.filename}`;
    }

    const updatedData = await update.save();

    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUpdate = async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);

    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }

    if (update.image) {
      const imagePath = path.join(__dirname, "..", update.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await update.deleteOne();

    res.json({ message: "Update deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};