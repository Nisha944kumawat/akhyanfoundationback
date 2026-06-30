const UpcomingEvent = require("../models/UpcomingEvent");

const getOrCreateUpcomingEvent = async () => {
  let data = await UpcomingEvent.findOne();

  if (!data) {
    data = await UpcomingEvent.create({
      location: "",
      events: [],
    });
  }

  return data;
};

exports.getUpcomingEventData = async (req, res) => {
  try {
    const data = await getOrCreateUpcomingEvent();
    res.status(200).json(data);
  } catch (error) {
    console.log("GET UPCOMING EVENT ERROR:", error);
    res.status(500).json({ message: "Failed to fetch upcoming event data" });
  }
};

exports.saveEventLocation = async (req, res) => {
  try {
    const { location } = req.body;

    if (!location || !location.trim()) {
      return res.status(400).json({ message: "Location is required" });
    }

    const data = await getOrCreateUpcomingEvent();
    data.location = location.trim();

    await data.save();

    res.status(200).json({
      message: "Location saved successfully",
      data,
    });
  } catch (error) {
    console.log("SAVE LOCATION ERROR:", error);
    res.status(500).json({ message: "Failed to save location" });
  }
};

exports.deleteEventLocation = async (req, res) => {
  try {
    const data = await getOrCreateUpcomingEvent();
    data.location = "";

    await data.save();

    res.status(200).json({
      message: "Location deleted successfully",
      data,
    });
  } catch (error) {
    console.log("DELETE LOCATION ERROR:", error);
    res.status(500).json({ message: "Failed to delete location" });
  }
};

exports.addUpcomingEvent = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Event text is required" });
    }

    const data = await getOrCreateUpcomingEvent();

    data.events.push({
      text: text.trim(),
    });

    await data.save();

    res.status(201).json({
      message: "Event added successfully",
      data,
    });
  } catch (error) {
    console.log("ADD EVENT ERROR:", error);
    res.status(500).json({ message: "Failed to add event" });
  }
};

exports.deleteUpcomingEvent = async (req, res) => {
  try {
    const data = await getOrCreateUpcomingEvent();

    data.events = data.events.filter(
      (eventItem) => eventItem._id.toString() !== req.params.id
    );

    await data.save();

    res.status(200).json({
      message: "Event deleted successfully",
      data,
    });
  } catch (error) {
    console.log("DELETE EVENT ERROR:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};