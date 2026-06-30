const Donor = require("../models/Donor");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

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

    const donor = await Donor.create({
      photo: `${BASE_URL}/uploads/donors/${req.file.filename}`,
      name,
      amount,
      mobile,
    });

    res.status(201).json({
      message: "Donor added successfully",
      donor,
    });
  } catch (error) {
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

    const fileName = donor.photo.split("/").pop();
    const filePath = path.join(__dirname, "../uploads/donors", fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Donor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Donor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Donor delete failed",
      error: error.message,
    });
  }
};