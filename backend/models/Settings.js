const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({

    adminName:{

        type:String,

        default:"Controller of Examination"

    },

    adminEmail:{

        type:String,

        default:"admin@krmu.edu.in"

    },

    passMarks:{

        type:Number,

        default:40

    },

    quizTime:{

        type:Number,

        default:2

    },

    certificateTitle:{

        type:String,

        default:"Certificate of Achievement"

    },

    theme:{

        type:String,

        default:"blue"

    }

},
{

    timestamps:true

});

module.exports = mongoose.model("Settings",settingsSchema);