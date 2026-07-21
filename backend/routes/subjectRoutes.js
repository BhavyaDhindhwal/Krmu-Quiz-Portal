const express = require("express");

const router = express.Router();

const {

    addSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject

} = require("../controllers/subjectController");

// ====================================
// Get All Subjects
// ====================================

router.get("/", getAllSubjects);

// ====================================
// Get Single Subject
// ====================================

router.get("/:id", getSubjectById);

// ====================================
// Add Subject
// ====================================

router.post("/", addSubject);

// ====================================
// Update Subject
// ====================================

router.put("/:id", updateSubject);

// ====================================
// Delete Subject
// ====================================

router.delete("/:id", deleteSubject);

module.exports = router;