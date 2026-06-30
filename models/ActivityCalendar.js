const mongoose = require("mongoose");

const activityCalendarSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityCalendar", activityCalendarSchema);