const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const questionRoutes = require("./routes/questionRoutes");
const quizRoutes = require("./routes/quizRoutes");
const resultRoutes = require("./routes/resultRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const adminRoutes = require("./routes/adminRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const studentRoutes = require("./routes/studentRoutes");
const app = express();

// =====================================
// Middlewares
// =====================================

app.use(cors());

app.use(express.json());
app.use("/uploads",express.static("uploads"));

app.use(express.urlencoded({ extended: true }));

// =====================================
// Request Logger
// =====================================

app.use((req, res, next) => {

    console.log(`${req.method} ${req.originalUrl}`);

    next();

});

// =====================================
// Home Route
// =====================================

app.get("/", (req, res) => {

    res.send("Quiz Application Backend Running Successfully");

});

// =====================================
// Health Check
// =====================================

app.get("/api/check", (req, res) => {

    res.status(200).json({

        success: true,

        message: "Backend Running Successfully"

    });

});

// =====================================
// API Routes
// =====================================

app.use("/api/auth", authRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/quiz", quizRoutes);

app.use("/api/results", resultRoutes);

app.use("/api/certificate", certificateRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/settings", settingsRoutes);

app.use("/api/students", studentRoutes);

// ================================
// Serve Frontend
// ================================

app.use(express.static(path.join(__dirname, "../frontend")));

// =====================================
// 404 API Route
// =====================================

app.use("/api", (req, res) => {

    res.status(404).json({

        success:false,

        message:"API Route Not Found"

    });

});

// =====================================
// Frontend Route
// =====================================

app.get("*", (req, res) => {

    res.sendFile(

        path.join(__dirname, "../frontend/index.html")

    );

});

// =====================================
// Global Error Handler
// =====================================

app.use((err, req, res, next) => {

    console.log(err);

    res.status(500).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

});

// =====================================
// MongoDB Connection
// =====================================

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)

.then(() => {

    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {

        console.log(`Server Running On Port ${PORT}`);

    });

})

.catch((err) => {

    console.log("MongoDB Connection Error");

    console.log(err);

});