const Donor = require("../models/Donor");
const cloudinary = require("../config/cloudinary");

const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "aakhyaan-foundation/donors",
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

exports.getDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({
      message: "Donors fetch failed",
      error: error.message,
    });
  }
};

exports.addDonor = async (req, res) => {
  try {
    const { name, amount, mobile } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Photo is required" });
    }

    if (!name || !amount || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const uploadedPhoto = await uploadImageToCloudinary(req.file.buffer);

    const donor = await Donor.create({
      photo: uploadedPhoto.secure_url,
      public_id: uploadedPhoto.public_id,
      name: name.trim(),
      amount: amount.trim(),
      mobile: mobile.trim(),
    });

    res.status(201).json({
      message: "Donor added successfully",
      donor,
    });
  } catch (error) {
    console.log("ADD DONOR ERROR:", error);

    res.status(500).json({
      message: "Donor add failed",
      error: error.message,
    });
  }
};

exports.deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    if (donor.public_id) {
      await cloudinary.uploader.destroy(donor.public_id, {
        resource_type: "image",
      });
    }

    await donor.deleteOne();

    res.status(200).json({
      message: "Donor deleted successfully",
    });
  } catch (error) {
    console.log("DELETE DONOR ERROR:", error);

    res.status(500).json({
      message: "Donor delete failed",
      error: error.message,
    });
  }
};