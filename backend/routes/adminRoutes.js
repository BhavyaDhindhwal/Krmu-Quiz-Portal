const express = require("express");

const router = express.Router();

const {
    getDashboard,
    getAllStudents,
    deleteStudent
} = require("../controllers/adminController");

// Dashboard
router.get("/dashboard", getDashboard);

// Students
router.get("/students", getAllStudents);

// Delete Student
router.delete("/students/:id", deleteStudent);

module.exports = router;