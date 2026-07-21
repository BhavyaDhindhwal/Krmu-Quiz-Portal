const express = require("express");

const router = express.Router();

const {

    getAllCertificates,

    generateCertificate,

    deleteCertificate

} = require("../controllers/certificateController");

// ========================================
// Get All Certificates
// ========================================

router.get("/", getAllCertificates);

// ========================================
// Generate PDF Certificate
// ========================================

router.get("/download/:resultId", generateCertificate);

// ========================================
// Delete Certificate
// ========================================

router.delete("/:id", deleteCertificate);

module.exports = router;