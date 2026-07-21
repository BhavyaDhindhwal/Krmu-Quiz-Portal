const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================
// Student Registration
// ======================

exports.register = async (req, res) => {

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

        const userExists = await User.findOne({ email });

        if (userExists) {

            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });

        }
        console.log(req.body);
        console.log("Password:", password);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({

            fullName,
            email,
            password: hashedPassword,
            phone,
            rollNumber,
            course,
            semester,
            department,
            profilePhoto: req.file
                ? req.file.filename
                : "",
            role: "student"
        });


        res.status(201).json({

            success: true,
            message: "Registration Successful"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================
// Login
// ======================
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // ==========================
        // Fixed Admin Accounts
        // ==========================

        const admins = [
            {
                email: "admin1@krmu.com",
                password: "admin123",
                name: "Admin One"
            },
            {
                email: "admin2@krmu.com",
                password: "admin456",
                name: "Admin Two"
            },
            {
                email: "hod@krmu.com",
                password: "hod123",
                name: "HOD"
            }
        ];

        const admin = admins.find(
            a => a.email === email && a.password === password
        );

        if (admin) {

            const token = jwt.sign(

                {
                    role: "admin",
                    email: admin.email
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }

            );

            return res.status(200).json({

                success: true,
                token,

                user: {

                    fullName: admin.name,
                    email: admin.email,
                    role: "admin"

                }

            });

        }

        // ==========================
        // Student Login
        // ==========================

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {

            return res.status(401).json({

                success: false,
                message: "Incorrect Password"

            });

        }

        const token = jwt.sign(

            {

                id: user._id,
                role: user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.status(200).json({

            success: true,
            token,
            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================
// Get Student Profile
// ======================

exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        res.status(200).json({

            success: true,

            user

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};