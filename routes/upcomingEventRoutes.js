const express = require("express");

const {
  getUpcomingEventData,
  saveEventLocation,
  deleteEventLocation,
  addUpcomingEvent,
  deleteUpcomingEvent,
} = require("../controllers/upcomingEventController");

const { protectAdmin } = require("../middlewares/adminAuthMiddleware");

const router = express.Router();

router.get("/", getUpcomingEventData);

router.post("/location", protectAdmin, saveEventLocation);
router.delete("/location", protectAdmin, deleteEventLocation);

router.post("/events", protectAdmin, addUpcomingEvent);
router.delete("/events/:id", protectAdmin, deleteUpcomingEvent);

module.exports = router;