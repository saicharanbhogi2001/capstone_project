const mongoose=require('mongoose');
var Register=mongoose.Schema;
const userregister=new Register({
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    usermail:{
        type:String,
    },
    password:{
        type:String,
    },
    mobilenumber:{
        type:Number,
    }
});
module.exports = mongoose.model('Userregister',userregister);