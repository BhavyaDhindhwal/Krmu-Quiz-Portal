const Result = require("../models/Result");
const Question = require("../models/Question");
const User = require("../models/User");

// =====================================
// Submit Quiz
// =====================================

exports.submitQuiz = async (req, res) => {

    try {

        const {
            studentName,
            email,
            subject,
            answers
        } = req.body;

        // ==========================
        // Find Student
        // ==========================

        let student = null;

        if (email) {

            student = await User.findOne({ email });

        }

        if (!student) {

            student = await User.findOne({ fullName: studentName });

        }

        if (!student) {

            return res.status(404).json({

                success: false,
                message: "Student not found"

            });

        }

        // ==========================
        // Get Questions
        // ==========================

        const questions = await Question.find({ subject });

        let correct = 0;
        let wrong = 0;
        let score = 0;

        questions.forEach(q => {

            const answer = answers.find(

                a => a.questionId == q._id.toString()

            );

            if (answer) {

                if (answer.selectedOption == q.correctAnswer) {

                    correct++;

                    score += q.marks;

                }

                else {

                    wrong++;

                }

            }

            else {

                wrong++;

            }

        });

        // ==========================
        // Percentage
        // ==========================

        const percentage = Number(

            ((correct / questions.length) * 100).toFixed(2)

        );

        // ==========================
        // Grade
        // ==========================

        let grade = "";

        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B+";
        else if (percentage >= 60) grade = "B";
        else if (percentage >= 40) grade = "C";
        else grade = "F";

        const status = percentage >= 40 ? "Pass" : "Fail";

        const certificateId =
            "KRMU-" +
            Date.now();

        // ==========================
        // Save Result
        // ==========================
        console.log("===== STUDENT =====");

        console.log(student);

        console.log("Profile Photo :", student.profilePhoto);

        console.log("Roll :", student.rollNumber);
 
        console.log("Course :", student.course);

        console.log("Semester :", student.semester);
        
        const result = await Result.create({

            student: student._id,

            studentName: student.fullName,

            rollNumber: student.rollNumber,

            email: student.email,

            phone: student.phone,

            course: student.course,

            semester: student.semester,

            profilePhoto: student.profilePhoto,

            subject,

            totalQuestions: questions.length,

            correctAnswers: correct,

            wrongAnswers: wrong,

            score,

            percentage,

            grade,

            status,

            certificateId

        });

        console.log(result);

        // ==========================
        // Update Student Stats
        // ==========================

        student.totalQuizAttempted += 1;

        if (percentage > student.highestScore) {

            student.highestScore = percentage;

        }

        student.averageScore =

            (

                (

                    student.averageScore *

                    (student.totalQuizAttempted - 1)

                )

                +

                percentage

            )

            /

            student.totalQuizAttempted;

        await student.save();
        console.log("Updated User:", student);

        // ==========================
        // Return Result
        // ==========================

        res.status(200).json({

            success: true,

            message: "Quiz Submitted Successfully",

            result

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
// Get All Results
// =====================================

exports.getAllResults = async (req, res) => {

    try {

        const results = await Result.find()

            .populate("subject")

            .populate("student")

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            total: results.length,

            results

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Delete Result
// =====================================

exports.deleteResult = async (req, res) => {

    try {

        await Result.findByIdAndDelete(

            req.params.id

        );

        res.json({

            success: true,

            message: "Result Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



exports.getStudentStatistics = async (req, res) => {

    try {

        const studentId = req.params.id;

        const results = await Result.find({
            student: studentId
        }).populate("subject");

        const totalQuizAttempted = results.length;

        let highestScore = 0;
        let averageScore = 0;
        let passed = 0;
        let failed = 0;

        const subjectPerformance = {};

        if (results.length > 0) {

            highestScore = Math.max(
                ...results.map(r => r.percentage)
            );

            averageScore = Number(
                (
                    results.reduce(
                        (sum, r) => sum + r.percentage,
                        0
                    ) / results.length
                ).toFixed(2)
            );

            results.forEach(result => {

                if (result.status === "Pass")
                    passed++;
                else
                    failed++;

                const subjectName =
                    result.subject?.subjectName || "Unknown";

                if (!subjectPerformance[subjectName]) {

                    subjectPerformance[subjectName] = [];

                }

                subjectPerformance[subjectName].push(
                    result.percentage
                );

            });

        }

        let bestSubject = "-";
        let weakSubject = "-";

        let bestAvg = -1;
        let weakAvg = 101;

        const subjectData = [];

        for (const subject in subjectPerformance) {

            const avg =
                subjectPerformance[subject].reduce(
                    (a, b) => a + b,
                    0
                ) /
                subjectPerformance[subject].length;

            subjectData.push({

                subject,

                average: Number(avg.toFixed(2))

            });

            if (avg > bestAvg) {

                bestAvg = avg;

                bestSubject = subject;

            }

            if (avg < weakAvg) {

                weakAvg = avg;

                weakSubject = subject;

            }

        }

        res.status(200).json({

            success: true,

            totalQuizAttempted,

            highestScore,

            averageScore,

            passed,

            failed,

            bestSubject,

            weakSubject,

            subjectPerformance: subjectData,

            recentResults: results,

            history: results

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Student Quiz History
// =====================================

exports.getStudentHistory = async (req, res) => {

    try {

        const studentId = req.params.id;

        const history = await Result.find({

            student: studentId

        })

        .populate("subject")

        .sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            total: history.length,

            history

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =====================================
// Performance Summary
// =====================================

exports.getPerformanceSummary = async (req, res) => {

    try {

        const studentId = req.params.id;

        const results = await Result.find({
            student: studentId
        }).populate("subject");

        if (results.length === 0) {

            return res.json({

                success: true,

                summary: {

                    average: 0,

                    highest: 0,

                    passed: 0,

                    failed: 0,

                    bestSubject: "-",

                    weakSubject: "-"

                }

            });

        }

        const highest = Math.max(
            ...results.map(r => r.percentage)
        );

        const average = (
            results.reduce((sum, r) => sum + r.percentage, 0)
            / results.length
        ).toFixed(2);

        const passed = results.filter(
            r => r.status === "Pass"
        ).length;

        const failed = results.filter(
            r => r.status === "Fail"
        ).length;

        res.json({

            success: true,

            summary: {

                highest,

                average,

                passed,

                failed,

                bestSubject: "Coming Soon",

                weakSubject: "Coming Soon"

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};