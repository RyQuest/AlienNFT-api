var mongoose = require('mongoose');
const validator = require('validator');

/**********RegistrationSchema**********/
var UserRegistrationSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} Entered Invalid Email'
        }
    },
    mobile_no:{
        type:String,
        default:''
    },
    password:{
        type:String,
    },
    otp:{
        type:String,
        default:''
    },
    user_role:{
        type:String,
        enum:['user'],
        default:'user'
    },
    status:{
        type:String,
        default:""
    },
    token:{
        type:String,
        default:""
    }
},{ timestamps: true });

var Registration =  mongoose.model('users', UserRegistrationSchema);
module.exports = {
    Registration : Registration
};