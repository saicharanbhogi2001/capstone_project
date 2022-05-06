const mongoose=require('mongoose');
const Ecommerce =mongoose.Schema;//database
const Products = new mongoose.Schema({//users collection no 1
    product_id:{
        type:String,
    },
    Category_name:{
        type:String,
    },
    Product_name:{
        type:String,  
    },
    Quantity:{
        type:String
    },
    Store_name:{
        type:String,
    },
    Images:{
        type:String,
    },
    Description:{
        type:String,
    },
    Price:{
        type:Number,
    },
    Store_id:{
        type:String,
        
    },
    Category_id:{
        type:String,
    },
    Sub_category_id:{
        type:String,
    },
    Sub_category_name:{
        type:String,
    },
    Brand_id:{
        type:String,
    },
    Brand_name:{
        type:String,
    },

});
module.exports=mongoose.model('Products',Products);