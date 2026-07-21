const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quizController");

console.log("Quiz Controller:", quizController);

router.get("/start/:subjectId", quizController.startQuiz);

module.exports = router;