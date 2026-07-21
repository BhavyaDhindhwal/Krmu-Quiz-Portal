const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const Result = require("../models/Result");
const User = require("../models/User");

// =====================================
// Calculate Grade
// =====================================

function calculateGrade(percentage) {

    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";

    return "F";

}

// =====================================
// Performance
// =====================================

function getPerformance(percentage) {

    if (percentage >= 90) return "Outstanding";
    if (percentage >= 80) return "Excellent";
    if (percentage >= 70) return "Very Good";
    if (percentage >= 60) return "Good";
    if (percentage >= 50) return "Average";

    return "Needs Improvement";

}

// =====================================
// Certificate ID
// =====================================

function generateCertificateId(index) {

    const year = new Date().getFullYear();

    return `KRMU-${year}-${String(index).padStart(5, "0")}`;

}

// =====================================
// Date Formatter
// =====================================

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-IN", {

        day: "2-digit",
        month: "long",
        year: "numeric"

    });

}

// =====================================
// Get All Certificates
// =====================================

exports.getAllCertificates = async (req, res) => {

    try {

        const results = await Result.find({

            status: "Pass"

        })

        .populate("subject")

        .sort({

            createdAt: -1

        });

        const certificates = [];

        for (let i = 0; i < results.length; i++) {

            const result = results[i];

            let user = null;

            if (result.email) {

                user = await User.findOne({

                    email: result.email

                });

            }

            if (!user) {

                user = await User.findOne({

                    fullName: result.studentName

                });

            }
                        certificates.push({

                _id: result._id,

                certificateId: generateCertificateId(i + 1),

                studentName: result.studentName,

                studentPhoto: user?.profilePhoto || "",

                rollNumber: user?.rollNumber || "-",

                email: user?.email || result.email || "-",

                phone: user?.phone || "-",

                course: user?.course || "B.Tech Full Stack Development",

                semester: user?.semester || "-",

                department: user?.department ||

                "School of Engineering & Technology",

                subject: result.subject,

                totalQuestions: result.totalQuestions || 0,

                correctAnswers: result.correctAnswers || 0,

                wrongAnswers: result.wrongAnswers || 0,

                score: result.score,

                percentage: result.percentage,

                grade:

                    result.grade ||

                    calculateGrade(result.percentage),

                performance:

                    getPerformance(result.percentage),

                status: result.status,

                createdAt: result.createdAt

            });

        }

        res.status(200).json({

            success: true,

            total: certificates.length,

            certificates

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
// Generate Certificate PDF
// =====================================

exports.generateCertificate = async (req, res) => {

    try {

        const result = await Result.findById(

            req.params.resultId

        ).populate("subject");

        if (!result) {

            return res.status(404).json({

                success: false,

                message: "Result Not Found"

            });

        }

        let user = null;

        if (result.email) {

            user = await User.findOne({

                email: result.email

            });

        }

        if (!user) {

            user = await User.findOne({

                fullName: result.studentName

            });

        }

        const certificateId =

            "KRMU-" +

            new Date().getFullYear() +

            "-" +

            result._id.toString().slice(-6);

        const grade =

            result.grade ||

            calculateGrade(result.percentage);

        const performance =

            getPerformance(result.percentage);

        const doc = new PDFDocument({

            size: "A4",

            layout: "landscape",

            margin: 35

        });

        res.setHeader(

            "Content-Type",

            "application/pdf"

        );

        res.setHeader(

            "Content-Disposition",

            `inline; filename=${result.studentName}-Certificate.pdf`

        );

        doc.pipe(res);
        // =====================================
// Premium Double Border
// =====================================

doc

.lineWidth(5)

.strokeColor("#D4AF37")

.roundedRect(

20,

20,

800,

555,

15

)

.stroke();

doc

.lineWidth(2)

.strokeColor("#0B3D91")

.roundedRect(

35,

35,

770,

525,

10

)

.stroke();

// =====================================
// University Logo
// =====================================

const logoPath = path.join(

    __dirname,

    "../uploads/logo.png"

);

if(fs.existsSync(logoPath)){

    doc.image(

        logoPath,

        55,

        45,

        {

            width:75

        }

    );

}

// =====================================
// University Name
// =====================================

doc

.fillColor("#0B3D91")

.font("Helvetica-Bold")

.fontSize(28)

.text(

    "K.R. Mangalam University",

    0,

    50,

    {

        align:"center"

    }

);

doc

.moveDown(0.4)

.fillColor("#D4AF37")

.fontSize(24)

.text(

    "CERTIFICATE OF ACHIEVEMENT",

    {

        align:"center"

    }

);

doc

.moveDown(0.5)

.fillColor("black")

.fontSize(15)

.font("Helvetica")

.text(

    "This Certificate is Proudly Presented To",

    {

        align:"center"

    }

);

// =====================================
// Student Photo
// =====================================

const photoPath = user?.profilePhoto

?

path.join(

    __dirname,

    "../uploads",

    user.profilePhoto

)

:

null;

if(

    photoPath &&

    fs.existsSync(photoPath)

){

    doc.image(

        photoPath,

        360,

        145,

        {

            width:90,

            height:90

        }

    );

}

// =====================================
// Student Name
// =====================================

doc

.moveDown(2)

.fillColor("#0B3D91")

.font("Helvetica-Bold")

.fontSize(26)

.text(

    result.studentName,

    {

        align:"center"

    }

);

doc

.moveDown(.5)

.fillColor("black")

.font("Helvetica")

.fontSize(16)

.text(

    `has successfully completed the ${

        result.subject?.subjectName || ""

    } Quiz Examination`,

    {

        align:"center"

    }

);
// =====================================
// Student Information
// =====================================

doc.moveDown(1.5);

doc

.font("Helvetica")

.fontSize(14)

.fillColor("black");

doc.text(

`Roll Number : ${user?.rollNumber || "-"}`,

80,

310

);

doc.text(

`Course : ${user?.course || "B.Tech Full Stack Development"}`,

80,

335

);

doc.text(

`Department : ${

user?.department ||

"School of Engineering & Technology"

}`,

80,

360

);

doc.text(

`Semester : ${user?.semester || "-"}`,

80,

385

);

doc.text(

`Certificate ID : ${certificateId}`,

80,

410

);

// =====================================
// Result Details
// =====================================

doc.text(

`Score : ${result.score}`,

500,

310

);

doc.text(

`Percentage : ${result.percentage}%`,

500,

335

);

doc.text(

`Grade : ${grade}`,

500,

360

);

doc.text(

`Performance : ${performance}`,

500,

385

);

doc.text(

`Issue Date : ${formatDate(result.createdAt)}`,

500,

410

);

// =====================================
// Gold Seal
// =====================================

doc

.circle(

405,

470,

35

)

.fillAndStroke(

"#D4AF37",

"#B8860B"

);

doc

.fillColor("white")

.fontSize(11)

.font("Helvetica-Bold")

.text(

"KRMU",

388,

462

);

doc.text(

"SEAL",

390,

477

);

// =====================================
// Signature
// =====================================

doc

.strokeColor("#000")

.moveTo(

600,

470

)

.lineTo(

740,

470

)

.stroke();

doc

.fillColor("black")

.fontSize(12)

.font("Helvetica")

.text(

"Authorized Signature",

600,

478

);

// =====================================
// Footer
// =====================================

doc

.fontSize(11)

.fillColor("gray")

.text(

"KRMU Quiz Portal | Computer Science Department",

0,

535,

{

align:"center"

}

);

// =====================================
// Finish PDF
// =====================================

doc.end();

}

catch(error){

    console.log(error);

    res.status(500).json({

        success:false,

        message:error.message

    });

}

};

// =====================================
// Delete Certificate
// =====================================

exports.deleteCertificate = async(req,res)=>{

    try{

        const result = await Result.findById(req.params.id);

        if(!result){

            return res.status(404).json({

                success:false,

                message:"Certificate Not Found"

            });

        }

        await Result.findByIdAndDelete(req.params.id);

        res.status(200).json({

            success:true,

            message:"Certificate Deleted Successfully"

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};