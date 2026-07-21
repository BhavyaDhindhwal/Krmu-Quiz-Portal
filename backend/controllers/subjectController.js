const Subject = require("../models/Subject");
const Question = require("../models/Question");

// ======================================
// Add Subject
// ======================================

exports.addSubject = async (req, res) => {

    try {

        const {

            subjectName,
            subjectCode,
            semester,
            department,
            description

        } = req.body;

        // Validation
        if (!subjectName || !subjectCode) {

            return res.status(400).json({

                success: false,
                message: "Subject Name and Subject Code are required."

            });

        }

        // Duplicate Subject Code
        const existingCode = await Subject.findOne({

            subjectCode: subjectCode.toUpperCase()

        });

        if (existingCode) {

            return res.status(400).json({

                success: false,
                message: "Subject Code already exists."

            });

        }

        // Duplicate Subject Name
        const existingName = await Subject.findOne({

            subjectName

        });

        if (existingName) {

            return res.status(400).json({

                success: false,
                message: "Subject Name already exists."

            });

        }

        const subject = await Subject.create({

            subjectName,

            subjectCode: subjectCode.toUpperCase(),

            semester: semester || 2,

            department:
                department ||
                "School of Engineering & Technology",

            description,

            totalQuestions: 0,

            isActive: true

        });

        res.status(201).json({

            success: true,

            message: "Subject Added Successfully",

            subject

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

// ======================================
// Get All Subjects
// ======================================

exports.getAllSubjects = async (req, res) => {

    try {

        const subjects = await Subject.find()

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            total: subjects.length,

            subjects

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
// ======================================
// Get Subject By ID
// ======================================

exports.getSubjectById = async (req, res) => {

    try {

        const subject = await Subject.findById(req.params.id);

        if (!subject) {

            return res.status(404).json({

                success: false,

                message: "Subject not found."

            });

        }

        res.status(200).json({

            success: true,

            subject

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

// ======================================
// Update Subject
// ======================================

exports.updateSubject = async (req, res) => {

    try {

        const {

            subjectName,
            subjectCode,
            semester,
            department,
            description

        } = req.body;

        const subject = await Subject.findById(req.params.id);

        if (!subject) {

            return res.status(404).json({

                success: false,

                message: "Subject not found."

            });

        }

        // Check Duplicate Code
        const duplicateCode = await Subject.findOne({

            subjectCode: subjectCode.toUpperCase(),

            _id: { $ne: req.params.id }

        });

        if (duplicateCode) {

            return res.status(400).json({

                success: false,

                message: "Subject Code already exists."

            });

        }

        // Check Duplicate Name
        const duplicateName = await Subject.findOne({

            subjectName,

            _id: { $ne: req.params.id }

        });

        if (duplicateName) {

            return res.status(400).json({

                success: false,

                message: "Subject Name already exists."

            });

        }

        subject.subjectName = subjectName;

        subject.subjectCode = subjectCode.toUpperCase();

        subject.semester = semester || subject.semester;

        subject.department = department || subject.department;

        subject.description = description;

        await subject.save();

        res.status(200).json({

            success: true,

            message: "Subject Updated Successfully",

            subject

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
// ======================================
// Delete Subject
// ======================================

exports.deleteSubject = async (req, res) => {

    try {

        const subjectId = req.params.id;

        // Check Subject
        const subject = await Subject.findById(subjectId);

        if (!subject) {

            return res.status(404).json({

                success: false,

                message: "Subject not found."

            });

        }

        // Check Questions
        const totalQuestions = await Question.countDocuments({

            subject: subjectId

        });

        if (totalQuestions > 0) {

            return res.status(400).json({

                success: false,

                message:
                    `Cannot delete subject. ${totalQuestions} question(s) are linked with this subject.`

            });

        }

        await Subject.findByIdAndDelete(subjectId);

        res.status(200).json({

            success: true,

            message: "Subject Deleted Successfully"

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

// ======================================
// Refresh Total Questions
// ======================================

exports.refreshQuestionCount = async (subjectId) => {

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

};