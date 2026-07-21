const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
    getStudents,
    getStudentById,
    addStudent,
    deleteStudent
} = require("../controllers/studentController");

const storage = multer.diskStorage({

    destination: function(req,file,cb){

        cb(null,"uploads/");

    },

    filename: function(req,file,cb){

        cb(null,Date.now()+"-"+file.originalname);

    }

});

const upload = multer({storage});

router.get("/test", (req, res) => {

    res.json({

        success: true,

        message: "Student Route Working"

    });

});

router.get("/",getStudents);

router.get("/:id",getStudentById);

router.post(
    "/",
    upload.single("profilePhoto"),
    addStudent
);

router.delete("/:id",deleteStudent);

module.exports=router;