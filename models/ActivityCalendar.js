const mongoose = require("mongoose");

const activityCalendarSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityCalendar", activityCalendarSchema);