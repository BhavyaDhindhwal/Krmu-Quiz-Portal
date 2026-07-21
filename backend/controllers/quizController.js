const Question = require("../models/Question");

// =======================================
// Start Quiz
// =======================================

exports.startQuiz = async (req, res) => {

    try {

        const { subjectId } = req.params;

        const questions = await Question.find({

            subject: subjectId

        }).select("-correctAnswer -explanation");

        res.status(200).json({

            success: true,

            totalQuestions: questions.length,

            questions

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};