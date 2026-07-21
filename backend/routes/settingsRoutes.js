const express = require("express");

const router = express.Router();

const {

    getSettings,

    saveSettings

} = require("../controllers/settingsController");

router.get("/", getSettings);

router.put("/", saveSettings);

module.exports = router;