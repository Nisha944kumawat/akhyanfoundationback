const ActivityCalendar = require("../models/ActivityCalendar");
const cloudinary = require("../config/cloudinary");

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "aakhyaan-foundation/activity-calendar",
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

exports.getActivityCalendarImages = async (req, res) => {
  try {
    const images = await ActivityCalendar.find().sort({ createdAt: 1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch images",
      error: error.message,
    });
  }
};

exports.uploadActivityCalendarImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const uploadedImage = await streamUpload(req.file.buffer);

    const image = await ActivityCalendar.create({
      image: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      image,
    });
  } catch (error) {
    console.log("UPLOAD ACTIVITY CALENDAR ERROR:", error);
    res.status(500).json({
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

exports.deleteActivityCalendarImage = async (req, res) => {
  try {
    const image = await ActivityCalendar.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await image.deleteOne();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.log("DELETE ACTIVITY CALENDAR ERROR:", error);
    res.status(500).json({
      message: "Failed to delete image",
      error: error.message,
    });
  }
};