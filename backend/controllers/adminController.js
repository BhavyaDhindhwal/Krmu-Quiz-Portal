const User = require("../models/User");
const Subject = require("../models/Subject");
const Question = require("../models/Question");
const Result = require("../models/Result");

// ========================================
// Dashboard Analytics
// ========================================

exports.getDashboard = async (req, res) => {

    try {

        // Dashboard Counts
        const totalStudents = await User.countDocuments({
            role: "student"
        });

        const totalSubjects = await Subject.countDocuments();

        const totalQuestions = await Question.countDocuments();

        const totalResults = await Result.countDocuments();

        // Pass Students
        const passedStudents = await Result.countDocuments({
            status: "Pass"
        });

        // Pass Percentage
        const passRate =
            totalResults === 0
                ? 0
                : Math.round((passedStudents / totalResults) * 100);

        // Average Percentage
        const avg = await Result.aggregate([
            {
                $group: {
                    _id: null,
                    averagePercentage: {
                        $avg: "$percentage"
                    }
                }
            }
        ]);

        const averageScore =
            avg.length > 0
                ? avg[0].averagePercentage.toFixed(2)
                : 0;

        // Recent Results
        const recentResults = await Result.find()

            .populate("subject", "subjectName")

            .sort({
                createdAt: -1
            })

            .limit(5);

        res.status(200).json({

            success: true,

            dashboard: {

                totalStudents,

                totalSubjects,

                totalQuestions,

                totalResults,

                passRate,

                averageScore

            },

            recentResults

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
// ========================================
// Get All Students
// ========================================

exports.getAllStudents = async (req, res) => {

    try {

        const students = await User.find({ role: "student" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            students
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.deleteStudent = async (req, res) => {

    try {

        const student = await User.findByIdAndDelete(req.params.id);

        if (!student) {

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });

        }

        res.json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};