const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "aakhyaan-foundation/gallery",
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

    const uploadedImage = await streamUpload(req.file.buffer);

    const image = await Gallery.create({
      image: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    });

    res.status(201).json({
      message: "Gallery image uploaded successfully",
      image,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to upload gallery image",
      error: error.message,
    });
  }
};

exports.deleteGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await image.deleteOne();

    res.status(200).json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete gallery image",
      error: error.message,
    });
  }
};