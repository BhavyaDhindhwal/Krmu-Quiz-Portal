const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({

    student:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User"

    },

    studentName:{

        type:String,

        required:true,

        trim:true

    },

    // ===== Student Details =====

    rollNumber:{

        type:String,

        default:""

    },

    email:{

        type:String,

        default:""

    },

    course:{

        type:String,

        default:""

    },

    semester:{

        type:Number,

        default:0

    },

    profilePhoto:{

        type:String,

        default:""

    },

    // ===========================

    subject:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Subject",

        required:true

    },

    totalQuestions:{

        type:Number,

        required:true

    },

    correctAnswers:{

        type:Number,

        required:true

    },

    wrongAnswers:{

        type:Number,

        required:true

    },

    score:{

        type:Number,

        required:true

    },

    percentage:{

        type:Number,

        required:true

    },

    grade:{

        type:String,

        default:""

    },

    status:{

        type:String,

        enum:["Pass","Fail"],

        required:true

    },

    timeTaken:{

        type:Number,

        default:0

    },

    certificateId:{

        type:String,

        default:""

    },

    remarks:{

        type:String,

        default:""

    }

},

{

    timestamps:true

});

module.exports = mongoose.model("Result",resultSchema);