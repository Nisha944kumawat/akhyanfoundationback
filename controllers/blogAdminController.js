const Blog = require("../models/Blog");
const fs = require("fs");
const path = require("path");

exports.getBlogImages = async (req, res) => {
  try {
    const images = await Blog.find().sort({ createdAt: 1 });
    res.status(200).json(images);
  } catch (error) {
    console.log("GET BLOG ERROR:", error);
    res.status(500).json({ message: "Failed to fetch blog images" });
  }
};

exports.uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const imagePath = `/uploads/blog/${req.file.filename}`;

    const image = await Blog.create({
      image: imagePath,
    });

    res.status(201).json({
      message: "Blog image uploaded successfully",
      image,
    });
  } catch (error) {
    console.log("UPLOAD BLOG ERROR:", error);
    res.status(500).json({
      message: "Failed to upload blog image",
      error: error.message,
    });
  }
};

exports.deleteBlogImage = async (req, res) => {
  try {
    const image = await Blog.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Blog image not found" });
    }

    const filePath = path.join(__dirname, "..", image.image);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await image.deleteOne();

    res.status(200).json({ message: "Blog image deleted successfully" });
  } catch (error) {
    console.log("DELETE BLOG ERROR:", error);
    res.status(500).json({ message: "Failed to delete blog image" });
  }
};