const Donate = require("../models/Donate");

exports.getDonateDetails = async (req, res) => {
  try {
    let donate = await Donate.findOne();

    if (!donate) {
      donate = await Donate.create({});
    }

    res.json(donate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDonateDetails = async (req, res) => {
  try {
    let donate = await Donate.findOne();

    if (!donate) {
      donate = await Donate.create({});
    }

    donate.title = req.body.title || donate.title;
    donate.description = req.body.description || donate.description;
    donate.accountName = req.body.accountName || donate.accountName;
    donate.accountNumber = req.body.accountNumber || donate.accountNumber;
    donate.ifscCode = req.body.ifscCode || donate.ifscCode;
    donate.bankName = req.body.bankName || donate.bankName;
    donate.upiId = req.body.upiId || donate.upiId;

    if (req.file) {
      donate.qrImage = `/uploads/${req.file.filename}`;
    }

    const updatedDonate = await donate.save();

    res.json(updatedDonate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};