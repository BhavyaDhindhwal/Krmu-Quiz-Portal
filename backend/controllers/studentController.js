const User = require("../models/User");
const bcrypt = require("bcrypt");

// ======================================
// Get All Students
// ======================================

exports.getStudents = async (req, res) => {

    try {

        const students = await User.find({

            role: "student"

        })

        .select("-password")

        .sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            total: students.length,

            students

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================
// Add Student
// ======================================

exports.addStudent = async (req, res) => {

    try {

        const {

            fullName,

            email,

            password,

            phone,

            rollNumber,

            course,

            semester,

            department

        } = req.body;

        // ===========================
        // Validation
        // ===========================

        if (

            !fullName ||

            !email ||

            !password ||

            !phone ||

            !rollNumber

        ) {

            return res.status(400).json({

                success: false,

                message: "Please fill all required fields."

            });

        }

        // ===========================
        // Check Email
        // ===========================

        const emailExists = await User.findOne({

            email

        });

        if (emailExists) {

            return res.status(400).json({

                success: false,

                message: "Email already exists."

            });

        }

        // ===========================
        // Check Roll Number
        // ===========================

        const rollExists = await User.findOne({

            rollNumber

        });

        if (rollExists) {

            return res.status(400).json({

                success: false,

                message: "Roll Number already exists."

            });

        }

        // ===========================
        // Encrypt Password
        // ===========================

        const hashedPassword =

            await bcrypt.hash(password, 10);

        // ===========================
        // Create Student
        // ===========================

        const student = await User.create({

            fullName,

            email,

            password: hashedPassword,

            phone,

            rollNumber,

            course,

            semester,

            department,

            role: "student",

            profilePhoto:

                req.file

                ? req.file.filename

                : ""

        });

        res.status(201).json({

            success: true,

            message: "Student Added Successfully",

            student

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Delete Student
// ======================================

exports.deleteStudent = async (req, res) => {

    try {

        const student = await User.findById(req.params.id);

        if (!student) {

            return res.status(404).json({

                success: false,

                message: "Student not found."

            });

        }

        if (student.role !== "student") {

            return res.status(400).json({

                success: false,

                message: "Only student accounts can be deleted."

            });

        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({

            success: true,

            message: "Student Deleted Successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================
// Get Single Student (Optional)
// ======================================

exports.getStudentById = async (req, res) => {

    try {

        const student = await User.findById(req.params.id)

            .select("-password");

        if (!student) {

            return res.status(404).json({

                success: false,

                message: "Student not found."

            });

        }

        res.status(200).json({

            success: true,

            student

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};