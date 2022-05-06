const mongoose=require('mongoose');
const Orders = new mongoose.Schema({//users collection no 1
    usermail:{
        type:String,
    },
    sellermail:{
        type:String,
    },
    product_name:{
        type:String,
    },
    price:{
        type:Number,
    },
    images:{
        type:String,
    },
});
module.exports=mongoose.model('Orders',Orders);
