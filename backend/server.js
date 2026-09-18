require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const catalogRoutes = require("./routes/catalogRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const communicationRoutes = require("./routes/communicationRoutes");
const { ensureAdmin } = require("./controllers/authController");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/galleries", galleryRoutes);
app.use("/api/communication", communicationRoutes);

app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});

const PORT = process.env.PORT || 5000;

connectDB().then(ensureAdmin).catch(() => {});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});