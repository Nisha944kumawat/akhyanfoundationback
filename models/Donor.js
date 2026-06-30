const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donor", donorSchema);