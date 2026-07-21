const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
{
    subjectName:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    subjectCode:{
        type:String,
        required:true,
        unique:true,
        uppercase:true
    },

    semester:{
        type:Number,
        default:2
    },

    department:{
        type:String,
        default:"School of Engineering & Technology"
    },

    description:{
        type:String,
        default:""
    },

    totalQuestions:{
        type:Number,
        default:0
    },

    isActive:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Subject", subjectSchema);