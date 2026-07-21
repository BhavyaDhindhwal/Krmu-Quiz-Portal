const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    fullName:{

        type:String,

        required:true,

        trim:true

    },

    email:{

        type:String,

        required:true,

        unique:true,

        lowercase:true,

        trim:true

    },

    password:{

        type:String,

        required:true

    },

    phone:{

        type:String,

        required:true,

        trim:true

    },

    rollNumber:{

        type:String,

        required:true,

        unique:true,

        trim:true

    },

    course:{

        type:String,

        default:"B.Tech Full Stack Development"

    },

    semester:{

        type:Number,

        default:2

    },

    department:{

        type:String,

        default:"School of Engineering & Technology"

    },

    profilePhoto:{

        type:String,

        default:""

    },

    role:{

        type:String,

        enum:["admin","student"],

        default:"student"

    },

    isActive:{

        type:Boolean,

        default:true

    },

    lastLogin:{

        type:Date,

        default:null

    },

    totalQuizAttempted:{

        type:Number,

        default:0

    },

    highestScore:{

        type:Number,

        default:0

    },

    averageScore:{

        type:Number,

        default:0

    }

},
{

    timestamps:true

});

module.exports = mongoose.model("User",userSchema);