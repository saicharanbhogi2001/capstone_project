const mongoose=require('mongoose');
var Register=mongoose.Schema;
const sellerregister=new Register({
    sellername:{
        type:String,
    },
    gstno:{
        type:String,
    },
    sellermail:{
        type:String,
    },
    password:{
        type:String,
    },
    mobilenumber:{
        type:Number,
    }
});
module.exports = mongoose.model('Sellerregister',sellerregister);