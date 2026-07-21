const Question = require("../models/Question");
const Subject = require("../models/Subject");

// =====================================
// Refresh Subject Question Count
// =====================================

async function refreshQuestionCount(subjectId) {

    try {

        const totalQuestions = await Question.countDocuments({

            subject: subjectId

        });

        await Subject.findByIdAndUpdate(subjectId, {

            totalQuestions

        });

    }

    catch (error) {

        console.log(error);

    }

}

// =====================================
// Add Question
// =====================================

exports.addQuestion = async (req, res) => {

    try {

        const {

            subject,
            question,
            options,
            correctAnswer,
            difficulty,
            marks,
            explanation

        } = req.body;

        // Validation

        if (
            !subject ||
            !question ||
            !options ||
            options.length < 4
        ) {

            return res.status(400).json({

                success: false,

                message: "Please fill all required fields."

            });

        }

        const newQuestion = await Question.create({

            subject,

            question,

            options,

            correctAnswer,

            difficulty,

            marks,

            explanation

        });

        // Update Subject Question Count

        await refreshQuestionCount(subject);

        res.status(201).json({

            success: true,

            message: "Question Added Successfully",

            question: newQuestion

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Get All Questions
// =====================================

exports.getAllQuestions = async (req, res) => {

    try {

        const questions = await Question.find()

            .populate("subject")

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            total: questions.length,

            questions

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Get Questions By Subject
// =====================================

exports.getQuestionsBySubject = async (req, res) => {

    try {

        const { subjectId } = req.params;

        const questions = await Question.find({

            subject: subjectId

        })

        .populate("subject")

        .sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            total: questions.length,

            questions

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Update Question
// =====================================

exports.updateQuestion = async (req, res) => {

    try {

        const {

            subject,
            question,
            options,
            correctAnswer,
            difficulty,
            marks,
            explanation

        } = req.body;

        const existingQuestion = await Question.findById(req.params.id);

        if (!existingQuestion) {

            return res.status(404).json({

                success: false,

                message: "Question not found."

            });

        }

        existingQuestion.subject = subject;

        existingQuestion.question = question;

        existingQuestion.options = options;

        existingQuestion.correctAnswer = correctAnswer;

        existingQuestion.difficulty = difficulty;

        existingQuestion.marks = marks;

        existingQuestion.explanation = explanation;

        await existingQuestion.save();

        // Refresh old subject count if subject changed

        if (
            existingQuestion.subject.toString() !== subject
        ) {

            await refreshQuestionCount(existingQuestion.subject);

        }

        // Refresh new subject count

        await refreshQuestionCount(subject);

        res.status(200).json({

            success: true,

            message: "Question Updated Successfully",

            question: existingQuestion

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Delete Question
// =====================================

exports.deleteQuestion = async (req, res) => {

    try {

        const question = await Question.findById(req.params.id);

        if (!question) {

            return res.status(404).json({

                success: false,

                message: "Question not found."

            });

        }

        const subjectId = question.subject;

        await Question.findByIdAndDelete(req.params.id);

        // Refresh Question Count

        await refreshQuestionCount(subjectId);

        res.status(200).json({

            success: true,

            message: "Question Deleted Successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Get Question By ID
// =====================================

exports.getQuestionById = async (req, res) => {

    try {

        const question = await Question.findById(req.params.id)

            .populate("subject");

        if (!question) {

            return res.status(404).json({

                success: false,

                message: "Question not found."

            });

        }

        res.status(200).json({

            success: true,

            question

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Search Questions
// =====================================

exports.searchQuestions = async (req, res) => {

    try {

        const keyword = req.query.keyword || "";

        const questions = await Question.find({

            question: {

                $regex: keyword,

                $options: "i"

            }

        })

        .populate("subject")

        .sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            total: questions.length,

            questions

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Dashboard Statistics
// =====================================

exports.getQuestionStats = async (req, res) => {

    try {

        const totalQuestions = await Question.countDocuments();

        const easy = await Question.countDocuments({

            difficulty: "Easy"

        });

        const medium = await Question.countDocuments({

            difficulty: "Medium"

        });

        const hard = await Question.countDocuments({

            difficulty: "Hard"

        });

        res.status(200).json({

            success: true,

            stats: {

                totalQuestions,

                easy,

                medium,

                hard

            }

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};