const express = require("express");
const router = express.Router();
const multer = require("multer");

const authController = require("../controllers/authController");

// Multer Storage
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        cb(null, Date.now() + "-" + file.originalname);

    }

});

const upload = multer({ storage });

// Register
router.post(
    "/register",
    upload.single("photo"),
    authController.register
);

// Login
router.post(
    "/login",
    authController.login
);

// 👇 NEW
router.get(
    "/profile/:id",
    authController.getProfile
);

module.exports = router;