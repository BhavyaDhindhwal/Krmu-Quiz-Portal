const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({

    subject: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true

    },

    question: {

        type: String,
        required: true,
        trim: true

    },

    options: {

        type: [String],
        required: true,

        validate: {

            validator: function (value) {

                return value.length === 4;

            },

            message: "Exactly 4 options are required."

        }

    },

    correctAnswer: {

        type: Number,
        required: true,
        min: 0,
        max: 3

    },

    difficulty: {

        type: String,

        enum: ["Easy", "Medium", "Hard"],

        default: "Easy"

    },

    marks: {

        type: Number,

        default: 1

    },

    explanation: {

        type: String,

        default: ""

    },

    createdAt: {

        type: Date,

        default: Date.now

    }

});

module.exports = mongoose.model("Question", questionSchema);