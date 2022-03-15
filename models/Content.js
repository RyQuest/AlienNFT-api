var mongoose = require('mongoose');
const validator = require('validator');

/**********RegistrationSchema**********/
var contentSchema = mongoose.Schema({

    user_id:[{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],

    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:''
    },
    thumbnail:{
        type:String,
        default:''
    },
    dna:{
        type:String,
    },
    edition:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"approved"
    },
    date:{
        type:Number,
        required:true
    },
    attributes:[
       {
            trait_type:{
                type:Array,
                default:""
            },
            value:{
                type:Array,
                default:""
            }
       }
    ],
    compiler:{
        type:String,
        default:''
    }
    
});

var contentInfo =  mongoose.model('Content', contentSchema);
module.exports = {
    contentInfo : contentInfo
};