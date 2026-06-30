const mongoose = require("mongoose");

const upcomingEventSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      default: "",
      trim: true,
    },

    events: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UpcomingEvent", upcomingEventSchema);