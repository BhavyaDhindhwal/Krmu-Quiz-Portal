const Settings = require("../models/Settings");

// ==============================
// Get Settings
// ==============================

exports.getSettings = async (req, res) => {

    try {

        let settings = await Settings.findOne();

        if (!settings) {

            settings = await Settings.create({});

        }

        res.status(200).json({

            success: true,

            settings

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==============================
// Save Settings
// ==============================

exports.saveSettings = async (req, res) => {

    try {

        let settings = await Settings.findOne();

        if (!settings) {

            settings = await Settings.create(req.body);

        }

        else {

            settings = await Settings.findByIdAndUpdate(

                settings._id,

                req.body,

                { new: true }

            );

        }

        res.status(200).json({

            success: true,

            message: "Settings Updated Successfully",

            settings

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};