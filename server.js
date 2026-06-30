const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/donate", require("./routes/donateRoutes"));
app.use("/api/updates", require("./routes/updateRoutes"));
app.use("/api/admin-gallery", require("./routes/galleryAdminRoutes"));
app.use("/api/activity-calendar", require("./routes/activityCalendarRoutes"));
app.use("/api/admin-blog", require("./routes/blogAdminRoutes"));
app.use("/api/press-coverage", require("./routes/pressCoverageRoutes"));
app.use("/api/upcoming-events", require("./routes/upcomingEventRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/audit-documents", require("./routes/auditDocumentRoutes"));
app.use("/api/donors", require("./routes/donorRoutes"));

app.get("/", (req, res) => {
  res.send("Aakhyaan Foundation API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});