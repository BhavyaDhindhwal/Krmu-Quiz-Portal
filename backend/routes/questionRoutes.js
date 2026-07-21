const express = require("express");

const router = express.Router();

const {

    addQuestion,
    getAllQuestions,
    getQuestionsBySubject,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    searchQuestions,
    getQuestionStats

} = require("../controllers/questionController");

// ======================================
// Get All Questions
// ======================================

router.get("/", getAllQuestions);

// ======================================
// Search Questions
// ======================================

router.get("/search", searchQuestions);

// ======================================
// Question Statistics
// ======================================

router.get("/stats", getQuestionStats);

// ======================================
// Questions By Subject
// ======================================

router.get("/subject/:subjectId", getQuestionsBySubject);

// ======================================
// Get Single Question
// ======================================

router.get("/:id", getQuestionById);

// ======================================
// Add Question
// ======================================

router.post("/", addQuestion);

// ======================================
// Update Question
// ======================================

router.put("/:id", updateQuestion);

// ======================================
// Delete Question
// ======================================

router.delete("/:id", deleteQuestion);

module.exports = router;