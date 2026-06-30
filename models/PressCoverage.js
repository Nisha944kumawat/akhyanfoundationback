const mongoose = require("mongoose");

const pressCoverageSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PressCoverage", pressCoverageSchema);