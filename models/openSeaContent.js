var mongoose = require('mongoose');
const validator = require('validator');

/**********RegistrationSchema**********/
var openSeacontentSchema = mongoose.Schema({

   permalink:{
        type:String,
       
    },
    name:{
        type:String,
        
    },
    description:{
        type:String,
        
    },
    image_url:{
        type:String,
        default:''
    },
    image_url_thumbnail:{
        type:String,
        default:''
    },
    image_url_preview:{
        type:String,
        default:''
    },
    token_id:{
        type:String,
        default:''
    },
    status:{
        type:String,
        default:"approved"
    },
    date:{
        type: String,
        default:''
    },
    attributes:[
       {
            trait_type:{
                type:String,
                default:""
            },
            value:{
                type:String,
                default:""
            }
       }
    ]
    
});

var OpenSeacontentInfo =  mongoose.model('OpenSeaContent', openSeacontentSchema);
module.exports = {
    OpenSeacontentInfo : OpenSeacontentInfo
};