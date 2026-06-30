const mongoose = require("mongoose");

const donateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Donate Now",
    },

    description: {
      type: String,
      default: "",
    },

    accountName: {
      type: String,
      default: "",
    },

    accountNumber: {
      type: String,
      default: "",
    },

    ifscCode: {
      type: String,
      default: "",
    },

    bankName: {
      type: String,
      default: "",
    },

    upiId: {
      type: String,
      default: "",
    },

    qrImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donate", donateSchema);