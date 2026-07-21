const express = require("express");

const router = express.Router();

const {

    submitQuiz,

    getAllResults,

    getStudentStatistics,

    getStudentHistory,

    getPerformanceSummary

} = require("../controllers/resultController");

// ======================================
// Quiz
// ======================================

router.post("/submit", submitQuiz);

// ======================================
// Admin
// ======================================

router.get("/", getAllResults);

// ======================================
// Student Dashboard
// ======================================

router.get("/student/:id", getStudentStatistics);

// ======================================
// Student History
// ======================================

router.get("/history/:id", getStudentHistory);

// ======================================
// Performance Summary
// ======================================

router.get("/summary/:id", getPerformanceSummary);

module.exports = router;