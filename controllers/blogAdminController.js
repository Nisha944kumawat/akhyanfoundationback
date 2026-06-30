const Blog = require("../models/Blog");
const cloudinary = require("../config/cloudinary");

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "aakhyaan-foundation/blog",
        resource_type: "image",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    stream.end(fileBuffer);
  });
};

exports.getBlogImages = async (req, res) => {
  try {
    const images = await Blog.find().sort({ createdAt: 1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch blog images",
      error: error.message,
    });
  }
};

exports.uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const uploadedImage = await streamUpload(req.file.buffer);

    const image = await Blog.create({
      image: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
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

    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await image.deleteOne();

    res.status(200).json({ message: "Blog image deleted successfully" });
  } catch (error) {
    console.log("DELETE BLOG ERROR:", error);
    res.status(500).json({
      message: "Failed to delete blog image",
      error: error.message,
    });
  }
};