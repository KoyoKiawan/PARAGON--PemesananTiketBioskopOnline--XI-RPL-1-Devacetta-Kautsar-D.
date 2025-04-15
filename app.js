const express = require("express");
const cors = require("cors");
const path = require("path"); // ✅ Import path module
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
require('./config/db');

const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movie");
const adminRoutes = require("./routes/admin");
const seatRoutes = require("./routes/seat");
const showtimesRoutes = require("./routes/showtimes");
const ticketsRoutes = require("./routes/tickets");

// ✅ Serve static files from "uploads" folder
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

// ✅ Debug route to check if images are accessible
app.get("/uploads/movies/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads/movies", req.params.filename);
    res.sendFile(filePath);
});

// ✅ Register API routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/showtimes", showtimesRoutes);
app.use("/api/tickets", ticketsRoutes);

module.exports = app;
